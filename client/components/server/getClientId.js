"use server";

export default async function getClientId() {
  return process.env.CLIENT_ID;
}
