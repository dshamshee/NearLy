
export interface User {
    role: "CUSTOMER" | "WORKER" | "ADMIN";
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    avatar?: string;
    createdAt?: Date;
    updatedAt?: Date;
}