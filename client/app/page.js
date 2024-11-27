"use client";

import createCookie from "@/components/server/createCookie";
import { useEffect, useState } from "react";

export default function Home() {
  const [product, setProducts] = useState("Hi");
  useEffect(() => {
    const getProducts = async () => {
      const data = await fetch("http://localhost:1234/signup", {
        method: "POST",
      }).then((e) => {
        return e.text();
      });
      setProducts(data);
    };
    getProducts();
    createCookie("age", "10");
  }, []);
  return (
    <div>
      API {product} <br />
      Hi! the home page of the application is ready.
    </div>
  );
}
