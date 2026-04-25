import Image from "next/image";
import styles from "./page.module.css";
import Products from "@/components/Product";


export default function Home() {
  return (
    <main style={{ padding: 40 }}>
      <h1>Next.js + GraphQL + Supabase Products</h1>
      <Products />
    </main>
  );
}
