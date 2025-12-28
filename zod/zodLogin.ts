import {z} from 'zod'


const passwordValidator = z
.string()
.min(8, {message: "Password must be at least 8 characters"})
.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
})

export const zodLogin = z.object({
    email: z.email({message: "Invalid email address"}),
    password: z.string(),
    identifier: z.enum(["CUSTOMER", "WORKER", "ADMIN"], {message: "Invalid identifier"}),
})

export type zodLoginType = z.infer<typeof zodLogin>