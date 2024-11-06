"use server";
import { createWebAuthnChallenge, RefillingTokenBucket } from "@/utils/server";
import { encodeBase64 } from "@oslojs/encoding";
import { headers } from "next/headers";

const webauthnChallengeRateLimitBucket = new RefillingTokenBucket<string>(30, 10);

export async function createWebAuthnChallengeAction(): Promise<string> {
  console.log("create");
  const clientIP = (await headers()).get("X-Forwarded-For");
  if (clientIP !== null && !webauthnChallengeRateLimitBucket.consume(clientIP, 1)) throw new Error("Too many requests");
  return encodeBase64(createWebAuthnChallenge());
}
