import AdminModel from "@/models/admin";
import CustomerModel from "@/models/customer";
import WorkerModel from "@/models/worker";
import { getServerSession, NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // ...add more providers here
  ],


  callbacks: {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({user, account}: {user: any, account: any}){
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
                }
            }
        }

        // If no role found, default to CUSTOMER
        if(!role) {
            role = "CUSTOMER";
        }

        // Process based on role
        if(role === "WORKER"){
            const isWorker = await WorkerModel.findOne({email: user.email});
            if(!isWorker) return false;
            // Store role in account for jwt callback
            if(account) account.role = role;
        } else if(role === "ADMIN"){
            let existingAdmin = await AdminModel.findOne({email: user.email});
            if(!existingAdmin) {
                existingAdmin = await AdminModel.create({
                    role: "ADMIN",
                    email: user.email,
                    name: user.name,
                    avatar: user.image as string,
                    googleId: user.id
                })
            }
            // Store role in account for jwt callback
            if(account) account.role = role;
        } else if(role === "CUSTOMER"){
            let existingCustomer = await CustomerModel.findOne({email: user.email});
            if(!existingCustomer){
                existingCustomer = await CustomerModel.create({
                    role: "CUSTOMER",
                    email: user.email,
                    name: user.name,
                    avatar: user.image as string,
                    googleId: user.id
                })
            }
            // Store role in account for jwt callback
            if(account) account.role = role;
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
            let loggedInUser = await CustomerModel.findOne({email: token?.email});
            if(!loggedInUser){
                loggedInUser = await WorkerModel.findOne({email: token?.email});
                if(!loggedInUser){
                    loggedInUser = await AdminModel.findOne({email: token?.email});
                }
            }

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
