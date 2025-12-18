import {z} from 'zod'

const passwordValidator = z
.string()
.min(8, {message: "Password must be at least 8 characters"})
.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
})

export const zodSignup = z.object({
    name: z.string().min(3, {message: "Name must be at least 3 characters"}),
    email: z.email({message: "Invalid email address"}),
    verificationCode: z.string().min(6, {message: "Verification code must be 6 characters"}).max(6, {message: "Verification code must be 6 characters"}),
    password: passwordValidator,
    identifier: z.enum(["CUSTOMER", "WORKER", "ADMIN"], {message: "Invalid identifier"}),
})

export type zodSignupType = z.infer<typeof zodSignup>
