"use client";

import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SIGNUP_MUTATION = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    const [signup, { loading, error }] = useMutation(SIGNUP_MUTATION);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await signup({
                variables: form,
            });

            router.push("/login");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "50px auto" }}>
            <h2>Signup</h2>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
                <br /><br />

                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                />
                <br /><br />

                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                />
                <br /><br />

                <button disabled={loading}>
                    {loading ? "Signing up..." : "Signup"}
                </button>

                {error && <p style={{ color: "red" }}>{error.message}</p>}
            </form>
        </div>
    );
}
