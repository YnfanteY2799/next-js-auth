import { encodeBase32UpperCaseNoPadding } from "@oslojs/encoding";

export function generateRandomOTP(): string {
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  return encodeBase32UpperCaseNoPadding(bytes);
}

export function generateRandomRecoveryCode(): string {
  const recoveryCodeBytes = new Uint8Array(10);
  crypto.getRandomValues(recoveryCodeBytes);
  return encodeBase32UpperCaseNoPadding(recoveryCodeBytes);
}
