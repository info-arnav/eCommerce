"use client";

import AuthContext from "@/components/authProvider";
import { useContext, useEffect, useState } from "react";

export default function Home() {
  const [product, setProducts] = useState("Hi");
  const { Fetch } = useContext(AuthContext);
  useEffect(() => {}, []);
  return <div>Hi! the home page of the application is ready.</div>;
}
