"use client";

import { useContext } from "react";
import AuthContext from "./authProvider";

export default function Navigation() {
  const { authToken } = useContext(AuthContext);
  return <nav>{authToken}</nav>;
}
