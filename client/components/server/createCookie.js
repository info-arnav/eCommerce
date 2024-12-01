"use server";

import { cookies } from "next/headers";
export default async function createCookie(key, value) {
  const cookieStore = await cookies();
  cookieStore.set(key, value, {
    httpOnly: true,
    path: "/",
  });
  return;
}
