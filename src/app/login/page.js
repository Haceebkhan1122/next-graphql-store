"use client";

import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });

    const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await login({
                variables: form,
            });

            // JWT token save
            Cookies.set("authToken", `Bearer ${data.login}`);

            router.push("/");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "50px auto" }}>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
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
                    {loading ? "Logging in..." : "Login"}
                </button>

                {error && <p style={{ color: "red" }}>{error.message}</p>}
            </form>
        </div>
    );
}
