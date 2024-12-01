"use server";

import { cookies } from "next/headers";
export default async function getCookie(key) {
  const cookieStore = await cookies();
  const cookieData = cookieStore.get(key);
  return cookieData?.value || false;
}
