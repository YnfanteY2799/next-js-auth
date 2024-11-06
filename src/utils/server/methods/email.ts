// import { db } from "./db";

/* PENDING: Refactor Method related to db use */
export function verifyEmailInput(email: string): boolean {
  return /^.+@.+\..+$/.test(email) && email.length < 256;
}

/**
 * Async Method for cheking if a email exists (Considerating And is not working)
 * @param email String
 * @returns Boolean
 */
export function checkEmailAvailability(email: string): boolean {
  //   const row = db.queryOne("SELECT COUNT(*) FROM user WHERE email = ?", [email]);
  //   if (row === null) throw new Error();
  //   return row.number(0) === 0;

  return true;
}
