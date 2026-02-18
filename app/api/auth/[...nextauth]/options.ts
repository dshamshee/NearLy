import { getServerSession, NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import dbConnect from "@/utils/dbConnection";
import bcrypt from "bcryptjs";
import UserModel from "@/models/user";
import WorkerModel from "@/models/worker";
import CustomerModel from "@/models/customer";
import AdminModel from "@/models/admin";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
        id: "credentials",
        name: "Credentials",
        credentials: {
          identifier: {label: "Identifier", type: "text"},
          email: {label: "Email", type: "text"},
          password: {label: "Password", type: "password"},
        },

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async authorize(credentials: any): Promise<any>{
          await dbConnect();
          // console.log('credentials', credentials)

          // Check if all the credentials are not provided then throw an error
          if(!credentials?.email || !credentials?.password || !credentials?.identifier){
            throw new Error("Missing credentials");
          }

          try {
            const existingUser = await UserModel.findOne({email: credentials.email, role: credentials.identifier});
            if(!existingUser)  throw new Error ("No user found with this credentials");

            const isPasswordCorrect = await bcrypt.compare(credentials.password, existingUser.password as string);
            if(isPasswordCorrect) return existingUser;
            else throw new Error("Incorrect Password");

          } catch (error: unknown) {
            throw new Error(error as string)
          }
        }
      })
      
    // ...add more providers here
  ],


  pages: {
    error: "/login", // Redirect errors to login page
  },

  callbacks: {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({user, account}: {user: any, account: any}){
        await dbConnect();

        // For credentials provider, user already exists and was validated in authorize()
        // Skip user creation logic to avoid duplicate key errors
        if (account?.provider === "credentials") {
            return true;
        }

        // Extract role from cookie (set before calling signIn from client)
        // Client should set cookie before signIn: document.cookie = "authRole=WORKER; path=/"
        let role: "CUSTOMER" | "WORKER" | "ADMIN" | undefined = undefined;
        
        try {
            const cookieStore = await cookies();
            const roleCookie = cookieStore.get("authRole");
            role = roleCookie?.value?.toUpperCase() as "CUSTOMER" | "WORKER" | "ADMIN" | undefined;
        } catch {
            // If cookies() fails (e.g., in edge runtime), try alternative method
            // Fallback: try to extract from callbackUrl in account.state
            if (account?.state) {
                try {
                    const state = decodeURIComponent(account.state);
                    const roleMatch = state.match(/[?&]role=([^&]+)/);
                    if (roleMatch) {
                        role = roleMatch[1].toUpperCase() as "CUSTOMER" | "WORKER" | "ADMIN";
                    }
                } catch {
                    // Continue with undefined role
                    console.log("Error in extracting role from callbackUrl");
                }
            }
        }

        // If no role found, default to CUSTOMER
        if(!role) {
            role = "CUSTOMER";
        }

        // Check if user exists with the exact email AND role
        let existingUser = await UserModel.findOne({email: user.email, role});
        
        if(existingUser){
          // User exists with same email and role, proceed with sign in
          return true;
        }

        // Check if user exists with the same email but different role
        const userWithDifferentRole = await UserModel.findOne({email: user.email});
        if(userWithDifferentRole){
          // console.log("I am here")
          // User exists with this email but different role, restrict creation
          throw new Error("User already exists with a different role");
        }

        // No user exists with this email, create new user
        existingUser = await UserModel.create({
          role: role,
          email: user.email,
          name: user.name,
          googleId: user.id,
          avatar: user.image,
        });
        await existingUser.save();
        console.log("I am here 3")

        // set db according to the role
        if(role === "WORKER"){
          // console.log("I am here 4")
          await WorkerModel.create({
            userId: existingUser._id,
            isProfileCompleted: false,
          })
        } else if(role === "CUSTOMER"){
          // console.log("I am here 5")
          await CustomerModel.create({
            userId: existingUser._id,
          })
        } else if(role === "ADMIN") {
          // console.log("I am here 6")
          await AdminModel.create({
            userId: existingUser._id,
          })
        } else {
          // console.log("I am here 2")
          throw new Error("Invalid role");
        }
        // console.log("I am here 7")
        return true;
    },

    async jwt({ token, account, user }) {
        // Store role in token if available from account (set in signIn callback)
        if (account?.role) {
            token.role = account.role as "CUSTOMER" | "WORKER" | "ADMIN";
        }
        // For credentials provider: store full user in token to avoid DB lookup on every request
        if (user && account?.provider === "credentials") {
            const u = user as { _id?: { toString(): string } | string; role?: string; email?: string; name?: string; avatar?: string; image?: string };
            token._id = typeof u._id === "string" ? u._id : u._id?.toString?.();
            token.role = u.role as "CUSTOMER" | "WORKER" | "ADMIN";
            token.email = u.email;
            token.name = u.name;
            token.avatar = u.avatar ?? u.image ?? "";
        }
        // For OAuth: one-time DB lookup to get role (proxy uses token.role, no session lookup)
        if (user && account?.provider !== "credentials" && user.email) {
            await dbConnect();
            const dbUser = await UserModel.findOne({ email: user.email });
            if (dbUser) {
                token._id = dbUser._id.toString();
                token.role = dbUser.role as "CUSTOMER" | "WORKER" | "ADMIN";
                token.name = dbUser.name;
                token.avatar = dbUser.avatar ?? "";
            }
        }
        if (user) {
            token.email = token.email ?? user.email;
        }
        return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
        // Read from token (set in jwt callback) - no DB lookup on every request
        if (token?.email && session.user) {
            if (token._id && token.role) {
                session.user._id = new mongoose.Types.ObjectId(token._id);
                session.user.role = token.role;
                session.user.email = token.email;
                session.user.name = token.name ?? "";
                session.user.avatar = token.avatar ?? "";
            } else {
                // Fallback for OAuth tokens that don't have user data in JWT yet
                const loggedInUser = await UserModel.findOne({ email: token.email });
                if (!loggedInUser) throw new Error("User not found");
                session.user._id = loggedInUser._id;
                session.user.role = loggedInUser.role;
                session.user.email = loggedInUser.email;
                session.user.name = loggedInUser.name;
                session.user.avatar = loggedInUser.avatar || "";
            }
        }
        return Promise.resolve(session);
      },
  },


};

export async function GetServerSessionHere() {
  return await getServerSession(authOptions);
}
