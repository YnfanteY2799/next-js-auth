import { encryptString, hashPassword, generateRandomRecoveryCode, decryptToString } from "@/utils/server";
import { prisma } from "@/db";

import type { SessionUser } from "@/types/server";

export function verifyUsernameInput(username: string): boolean {
  return username.length > 3 && username.length < 32 && username.trim() === username;
}

export async function createUser(email: string, username: string, password: string): Promise<SessionUser> {
  const recoveryCode = encryptString(generateRandomRecoveryCode());
  const passwordHash = await hashPassword(password);

  const result = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      Status: { connect: { id: 1 } },
      recoveryCode: Buffer.from(recoveryCode),
    },
    select: { id: true, username: true, email: true },
  });

  if (result === null) throw new Error("Unexpected error");

  return {
    ...result,
    emailVerified: false,
    registered2FA: false,
    registeredTOTP: false,
    registeredPasskey: false,
    registeredSecurityKey: false,
  } as SessionUser;
}

export async function updateUserPassword(id: number, password: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  try {
    const result = await prisma.user.update({ data: { passwordHash }, where: { id } });
    return !!result;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function updateUserEmailAndSetEmailAsVerified(id: number, email: string): Promise<boolean> {
  try {
    const result = await prisma.user.update({ data: { email, isEmailVerified: 1 }, where: { id } });
    if (!result) return false;
    return !!result;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function setUserAsEmailVerifiedIfEmailMatches(id: number, email: string): Promise<boolean> {
  try {
    const result = await prisma.user.update({ data: { isEmailVerified: 1 }, where: { id, email } });
    if (!result) return false;
    return !!result;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function getUserPasswordHash(id: number): Promise<string> {
  try {
    const result = await prisma.user.findFirst({ select: { passwordHash: true }, where: { id } });
    if (!result) return "Not Found";
    return result.passwordHash;
  } catch (e) {
    throw Error(e as string);
  }
}

export async function getUserRecoverCode(id: number): Promise<string> {
  try {
    const result = await prisma.user.findUnique({ select: { recoveryCode: true }, where: { id } });
    if (!result) throw new Error("Invalid user ID");
    console.log({ result });
    return decryptToString(Buffer.from(result.recoveryCode));
  } catch (e) {
    throw Error(e as string);
  }
}

export async function getUserFromEmail(email: string): Promise<SessionUser | null> {
  try {
    const results = await prisma.user.findUnique({
      where: { email },
    });
    if (!results) return null;

    return {} as SessionUser;
  } catch (e) {
    console.log(e);
    return null;
  }

  //   db.queryOne(
  //     `SELECT user.id, user.email, user.username, user.email_verified, IIF(totp_credential.id IS NOT NULL, 1, 0), IIF(passkey_credential.id IS NOT NULL, 1, 0), IIF(security_key_credential.id IS NOT NULL, 1, 0) FROM user
  //         LEFT JOIN totp_credential ON user.id = totp_credential.user_id
  //         LEFT JOIN passkey_credential ON user.id = passkey_credential.user_id
  //         LEFT JOIN security_key_credential ON user.id = security_key_credential.user_id
  //         WHERE user.email = ?`,
  //     [email]
  //   );

  //   const user: User = {
  //     id: row.number(0),
  //     email: row.string(1),
  //     username: row.string(2),
  //     emailVerified: Boolean(row.number(3)),
  //     registeredTOTP: Boolean(row.number(4)),
  //     registeredPasskey: Boolean(row.number(5)),
  //     registeredSecurityKey: Boolean(row.number(6)),
  //     registered2FA: false,
  //   };
  //   if (user.registeredPasskey || user.registeredSecurityKey || user.registeredTOTP) {
  //     user.registered2FA = true;
  //   }
}
