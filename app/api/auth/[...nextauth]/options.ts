import AdminModel from "@/models/admin";
import CustomerModel from "@/models/customer";
import WorkerModel from "@/models/worker";
import { getServerSession, NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import dbConnect from "@/utils/dbConnection";
import bcrypt from "bcryptjs";
import {User} from '@/types/user'
import UserModel from "@/models/user";

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
          email: {label: "Email/Username", type: "text"},
          password: {label: "Password", type: "password"},
        },

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async authorize(credentials: any): Promise<any>{
          await dbConnect();
          console.log('credentials', credentials)

          // Check if all the credentials are not provided then throw an error
          if(!credentials?.email || !credentials?.password || !credentials?.identifier){
            throw new Error("Missing credentials");
          }

          try {
            const existingUser = await UserModel.findOne({email: credentials.email, role: credentials.identifier});
            if(!existingUser)  throw new Error ("No user found with this email or username");

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


  callbacks: {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({user, account}: {user: any, account: any}){
        await dbConnect();

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

        let existingUser = await UserModel.findOne({email: user.email, role})
        if(!existingUser){
          existingUser = await UserModel.create({
            role: role,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
          })
          await existingUser.save();
        }
        
        return true;
    },

    async jwt({ token, account, user }) {
        // Store role in token if available from account (set in signIn callback)
        if (account?.role) {
            token.role = account.role;
        }
        if (user) {
            token.email = user.email;
        }
        return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {

        if(token?.email){
            const loggedInUser = await UserModel.findOne({email: token?.email});
            if(!loggedInUser) throw new Error("User not found");

            if(loggedInUser && session.user){
                session.user._id = loggedInUser._id;
                session.user.role = loggedInUser.role;
                session.user.email = loggedInUser.email;
                session.user.name = loggedInUser.name;
                session.user.avatar = loggedInUser.avatar || "";
            }
        }

        return Promise.resolve(session);
      },
  }
};

export async function GetServerSessionHere() {
  return await getServerSession(authOptions);
}
