import { z } from "zod";

const passwordValidator = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
    }
  );

export const zodForgotEmail = z.object({
  email: z.email({ message: "Invalid email address" }),
});

export type zodForgotEmailType = z.infer<typeof zodForgotEmail>;

export const zodForgotReset = z
  .object({
    oldPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: passwordValidator,
    confirmPassword: passwordValidator,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password mismatch",
    path: ["confirmPassword"],
  });

export type zodForgotResetType = z.infer<typeof zodForgotReset>;

/** New password only (for email / cookie-based forgot-password completion) */
export const zodForgotNewPasswordOnly = z
  .object({
    newPassword: passwordValidator,
    confirmPassword: passwordValidator,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password mismatch",
    path: ["confirmPassword"],
  });

export type zodForgotNewPasswordOnlyType = z.infer<typeof zodForgotNewPasswordOnly>;
