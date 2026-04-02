/** HttpOnly cookie storing Mongo user id during forgot-password flow (10 min). */
export const FORGOT_PASSWORD_UID_COOKIE = "forgot_password_uid";

export const forgotPasswordCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 10, // 10 minutes
};
