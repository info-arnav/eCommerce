"use server";

export default async function getFingerprintSecret() {
  return process.env.FINGERPRINT_SECRET;
}
