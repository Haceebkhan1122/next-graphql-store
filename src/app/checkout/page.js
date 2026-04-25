"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useRouter } from 'next/navigation';


const GET_CART_ITEMS = gql`
  query {
    cartItems {
      id
      name
      price
      quantity
    }
  }
`;

// 2️⃣ CREATE ORDER MUTATION
const CREATE_ORDER = gql`
  mutation CreateOrder(
    $name: String!
    $email: String!
    $phone: String!
    $address: String!
    $items: String!
    $total: Int!
  ) {
    createOrder(
      name: $name
      email: $email
      phone: $phone
      address: $address
      items: $items
      total: $total
    ) {
      id
      name
      email
      total
    }
  }
`;

export default function Checkout() {
    const { data, loading, error } = useQuery(GET_CART_ITEMS);
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 3️⃣ useMutation hook
    const [createOrderMutation] = useMutation(CREATE_ORDER);

    let total = data?.cartItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const items = data?.cartItems?.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
        }));

        await createOrderMutation({
            variables: {
                name: form.name,
                email: form.email,
                phone: form.phone,
                address: form.address,
                items: JSON.stringify(items),
                total,
            },
        });

        alert("Order placed successfully! ✅");
        router.push('/')

    };


    if (loading) return <p>Loading cart...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;
    if (!data?.cartItems?.length) return <p>Your cart is empty 🛒</p>;

    return (
        <div style={{ maxWidth: 600, margin: "20px auto" }}>
            <h2>Checkout</h2>

            {/* Cart summary */}
            <div style={{ border: "1px solid #ccc", padding: 10, borderRadius: 6 }}>
                <h3>Cart Items</h3>
                {data?.cartItems?.map((item) => (
                    <div key={item.id} style={{ marginBottom: 8 }}>
                        {item.name} x {item.quantity} = ${item.price * item.quantity}
                    </div>
                ))}
                <strong>Total: ${total}</strong>
            </div>

            {/* User details form */}
            <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    style={{ display: "block", marginBottom: 10, width: "100%", padding: 8 }}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={{ display: "block", marginBottom: 10, width: "100%", padding: 8 }}
                />
                <input
                    maxLength={11}
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    style={{ display: "block", marginBottom: 10, width: "100%", padding: 8 }}
                />
                <textarea
                    name="address"
                    placeholder="Address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    style={{ display: "block", marginBottom: 10, width: "100%", padding: 8 }}
                />

                <button
                    type="submit"
                    style={{
                        background: "green",
                        color: "#fff",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                    }}
                >
                    Proceed to Payment (COD)
                </button>
            </form>
        </div>
    );
}
