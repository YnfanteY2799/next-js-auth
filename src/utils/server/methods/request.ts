import { RefillingTokenBucket } from "./rateLimit";
import { headers } from "next/headers";

export const globalBucket = new RefillingTokenBucket<string>(100, 1);

// Note: Assumes X-Forwarded-For will always be defined.

export async function globalGETRateLimit(): Promise<boolean> {
  const clientIP = (await headers()).get("X-Forwarded-For");
  if (clientIP === null) return true;
  return globalBucket.consume(clientIP, 1);
}

export async function globalPOSTRateLimit(): Promise<boolean> {
  const clientIP = (await headers()).get("X-Forwarded-For");
  if (clientIP === null) return true;
  return globalBucket.consume(clientIP, 3);
}
