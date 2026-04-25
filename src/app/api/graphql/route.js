import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { supabase } from "@/app/lib/supabase";
import bcrypt from "bcrypt";
import { verifyAuth } from "./auth";

const typeDefs = `
  type Profile {
    id: String!
    name: String!
    email: String!
    created_at: String!
  }

  type Product {
    id: String!
    name: String!
    price: Int!
    description: String
  }

  type Order {
    id: String!
    name: String!
    email: String!
    phone: String!
    address: String!
    total: Int!
    items: String!
    created_at: String!
  }

  type CartItem {
    id: String!
    name: String!
    price: Int!
    description: String
    quantity: Int!
  }

  type Query {
    products: [Product!]!
    cartItems: [CartItem!]!
    profile: Profile!
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!): Profile!
    login(email: String!, password: String!): String!
    addCartProduct(name: String!, price: Int!, description: String): CartItem!
    removeCartItem(id: String!): Boolean!
    createOrder(
      name: String!
      email: String!
      phone: String!
      address: String!
      items: String!
      total: Int!
    ): Order!
  }
`;

const resolvers = {
  Query: {
    products: async (_, __, { user }) => {
      if (!user) throw new Error("Unauthorized");
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw new Error(error.message);
      return data;
    },

    cartItems: async (_, __, { user }) => {
      if (!user) throw new Error("Unauthorized");
      const { data, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id);
      if (error) throw new Error(error.message);
      return data;
    },

    profile: async (_, __, { user }) => {
      if (!user) throw new Error("Unauthorized");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
  },

  Mutation: {
    signup: async (_, { name, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const { data, error } = await supabase
        .from("profiles")
        .insert([{ name, email, password: hashedPassword }])
        .select();
      if (error) throw new Error(error.message);
      return data[0];
    },

    login: async (_, { email, password }) => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (!data) throw new Error("Invalid credentials");

      const valid = await bcrypt.compare(password, data.password);
      if (!valid) throw new Error("Invalid credentials");

      const jwt = require("jsonwebtoken");
      return jwt.sign(
        { id: data.id, email: data.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
    },

    addCartProduct: async (_, args, { user }) => {
      if (!user) throw new Error("Unauthorized");

      const { data, error } = await supabase
        .from("cart_items")
        .insert([{ ...args, user_id: user.id }])
        .select();

      if (error) throw new Error(error.message);
      return data[0];
    },

    removeCartItem: async (_, { id }, { user }) => {
      if (!user) throw new Error("Unauthorized");

      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw new Error(error.message);
      return true;
    },

    createOrder: async (_, args, { user }) => {
      if (!user) throw new Error("Unauthorized");

      const { data, error } = await supabase
        .from("orders")
        .insert([{ ...args, id: user.id }]) // ensure orders table has user_id
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        throw new Error(error.message);
      }

      if (!data || !data[0]) {
        throw new Error("Failed to create order");
      }

      return data[0];
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

export const GET = startServerAndCreateNextHandler(server, {
  context: async (request) => {
    try {
      const authHeader = request.headers.get("authorization") || "";
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

      const user = verifyAuth(token); // token string
      return { user };
    } catch (err) {
      console.log("Auth error:", err);
      return { user: null };
    }
  },
});

export const POST = GET;
