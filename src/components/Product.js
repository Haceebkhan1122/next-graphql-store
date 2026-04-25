"use client";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";


const GET_PRODUCTS = gql`
  query {
    products {
      id
      name
      price
      description
    }
  }
`;

// 2️⃣ Mutation to add product to cart
const ADD_TO_CART = gql`
  mutation AddCartProduct($name: String!, $price: Int!, $description: String) {
    addCartProduct(name: $name, price: $price, description: $description) {
      id
      name
      price
      description
    }
  }
`;

const GET_USER_PROFILE = gql`
  query {
    profile {
      name
    }
  }
`;

export default function Products() {
    const { loading, error, data } = useQuery(GET_PRODUCTS);
    const {
        data: profileData,
        loading: profileLoading,
        error: profileError,
    } = useQuery(GET_USER_PROFILE);
    const [addCartProduct, { loading: cartLoading, error: cartError }] = useMutation(ADD_TO_CART)
    const router = useRouter();

    if (loading) return <p>Loading products...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

    const handleAddToCart = async (product) => {
        try {
            const result = await addCartProduct({
                variables: {
                    name: product.name,
                    price: product.price,
                    description: product.description,
                },
            });
            console.log("Added to cart:", result.data.addCartProduct);
            alert("Product added to cart ✅");
        } catch (err) {
            console.error(err);
            alert("Error adding product ❌");
        }
    };

    const handleLogout = () => {
        Cookies.remove('authToken');
        router.push('/login')
    }

    return (
        <div style={{ marginTop: 20 }}>
            <h1 style={{ marginBottom: '10px', textAlign: 'right' }}>User: {profileData?.profile?.name}</h1>
            <button onClick={() => handleLogout()} style={{ marginBottom: '10px', textAlign: 'right', display: 'block', padding: '10px', marginRight: '0', marginLeft: 'auto'}}>Logout</button>
            <Link href="/cart" style={{ marginBottom: '15px', display: 'block', backgroundColor: 'grey', width: '100px', padding: '10px' }}>Go to Cart</Link>
            {data.products.map((product) => (
                <div
                    key={product.id}
                    style={{
                        border: "1px solid #ccc",
                        padding: 10,
                        marginBottom: 10,
                        borderRadius: 6,
                    }}
                >
                    <h3>{product.name}</h3>
                    <p>Price: ${product.price}</p>
                    <p>{product.description}</p>
                    <button
                        disabled={cartLoading}
                        onClick={() => handleAddToCart(product)}
                        style={{
                            cursor: 'pointer'
                        }}
                    >
                        {cartLoading ? "Adding..." : "Add To Cart"}
                    </button>
                </div>
            ))}
        </div>
    );
}
