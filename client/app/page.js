"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [product, setProducts] = useState("Hi");
  useEffect(() => {}, []);
  return <div>Hi! the home page of the application is ready.</div>;
}
