"use client";

import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import Link from "next/link";


// 1️⃣ GET CART ITEMS QUERY
const GET_CART_ITEMS = gql`
  query {
    cartItems {
      id
      name
      price
      description
      quantity
    }
  }
`;

// 🔹 REMOVE CART ITEM
const REMOVE_CART_ITEM = gql`
  mutation RemoveCartItem($id: String!) {
    removeCartItem(id: $id)
  }
`;

export default function Cart() {
    // 2️⃣ Query call
    const { loading, error, data } = useQuery(GET_CART_ITEMS);

    // 4️⃣ Remove mutation
    const [removeCartItem, { loading: removing }] = useMutation(
        REMOVE_CART_ITEM,
        {
            refetchQueries: [{ query: GET_CART_ITEMS }], // 🔥 auto refresh cart
        }
    );

    // 3️⃣ Loading / Error states
    if (loading) return <p>Loading cart...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

    // 4️⃣ Empty cart case
    if (data.cartItems.length === 0) {
        return <p>Your cart is empty 🛒</p>;
    }

    return (
        <div style={{ marginTop: 20 }}>
            <Link href="/checkout" style={{ marginBottom: '15px', display: 'block', backgroundColor: 'grey', width: '140px', padding: '10px' }}>Go to Checkout</Link>
            <h2>My Cart</h2>
            {data?.cartItems?.map((item) => (
                <div
                    key={item.id}
                    style={{
                        border: "1px solid #ccc",
                        padding: 10,
                        marginBottom: 10,
                        borderRadius: 6,
                    }}
                >
                    <h3>{item.name}</h3>
                    <p>Price: ${item.price}</p>
                    {/* <p>Quantity: {item.quantity}</p> */}
                    {item.description && <p>{item.description}</p>}
                    {/* 🔴 REMOVE BUTTON */}
                    <button
                        onClick={() =>
                            removeCartItem({
                                variables: { id: item.id },
                            })
                        }
                        disabled={removing}
                        style={{
                            background: "red",
                            color: "#fff",
                            padding: "6px 10px",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                            marginTop: 8,
                        }}
                    >
                        {removing ? "Removing..." : "Remove"}
                    </button>
                </div>
            ))}
        </div>
    );
}
