import mongoose from "mongoose";
import { DefaultSession } from "next-auth";

// Extending the session object
declare module "next-auth" {
  interface Session {
    user: {
      _id: mongoose.Types.ObjectId;
      role: "CUSTOMER" | "WORKER" | "ADMIN";
      email: string;
      name: string;
      avatar: string;
      // Include any other custom properties you need
    } & DefaultSession["user"];
  }

}