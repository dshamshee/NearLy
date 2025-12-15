export interface Admin {
    role: "ADMIN";
    name: string;
    email: string;
    phone?: string;
    password?: string;
    googleId?: string;
    avatar?: string;
    createdAt?: Date;
    updatedAt?: Date;
}