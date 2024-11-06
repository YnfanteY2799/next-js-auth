import type { User } from "@prisma/client";

export interface WebAuthnUserCredential {
  name: string;
  id: Uint8Array;
  userId: number;
  algorithmId: number;
  publicKey: Uint8Array;
}

export interface RefillBucket {
  count: number;
  refilledAt: number;
}

export interface ExpiringBucket {
  count: number;
  createdAt: number;
}

export interface ThrottlingCounter {
  timeout: number;
  updatedAt: number;
}

export interface SessionFlags {
  twoFactorVerified: boolean;
}

export interface Session extends SessionFlags {
  id: string;
  userId: number;
  expiresAt: Date;
}

export type SessionUser = Partial<User> & {
  emailVerified: boolean;
  registered2FA: boolean;
  registeredTOTP: boolean;
  registeredPasskey: boolean;
  registeredSecurityKey: boolean;
};

export type SessionValidationResult = { session: Session; user: SessionUser } | { session: null; user: null };

export interface EmailVerificationRequest {
  id: string;
  code: string;
  email: string;
  userId: number;
  expiresAt: Date;
}
