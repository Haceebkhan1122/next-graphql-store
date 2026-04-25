import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Cookies from "js-cookie";

// HTTP link
const httpLink = new HttpLink({
    uri: "/api/graphql",
    credentials: "include", // send cookies automatically
});

// Auth link
const authLink = setContext((_, { headers }) => {
    let token = null;

    if (typeof window !== "undefined") {
        token = Cookies.get("authToken"); // read your cookie
    }

    // Ensure the token is only the JWT without duplicated "Bearer "
    if (token?.startsWith("Bearer ")) {
        token = token.slice(7);
    }

    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : "", // proper format
        },
    };
});

// Apollo Client instance
export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});
