"use client"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
  } from "@/components/ui/field";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { zodLogin, zodLoginType } from "@/zod/zodLogin";
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { signInWithRole } from "@/utils/authHelpers";
import { useState } from "react";


export default function LoginPage() {
  const { data: session } = useSession();
  console.log("session in login page", session);

    const router = useRouter();
    const [role, setRole] = useState<"CUSTOMER" | "WORKER" | "ADMIN">("CUSTOMER");

    const form = useForm<zodLoginType>({
        resolver: zodResolver(zodLogin),
        defaultValues: {
          email: "",
          password: "",
          identifier: "CUSTOMER",
        },
      });
    
      const onSubmit = async (data: zodLoginType) => {
        try {
          const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            identifier: data.identifier,
            callbackUrl: "/",
          });

          if (result?.error) {
            toast.error(result.error || "Login failed");
          } else if (result?.ok) {
            toast.success("Login successful");
            router.push("/");
          }
        } catch (error) {
          toast.error("An error occurred during login");
          console.error("Login error:", error);
        }
      };

      const loginWithGoogle = async()=>{
        // console.log("role", role);
        try {
            await signInWithRole("google", role, "/");
        } catch (error) {
            toast.error("An error occurred during login");
            console.error("Login error:", error);
        }
      }




  return (
    <div className="mainContainer min-h-screen p-4 flex flex-col items-center justify-center bg-background">
      
        <h1 className="text-2xl font-bold text-foreground">
          Welcome to <span className="text-muted-foreground">Near</span>
          <span className="text-orange-500">Ly</span>
        </h1>
        <div className="flex flex-col gap-2 w-full max-w-md border-2 border-border justify-center items-center mt-4 p-4 rounded-md">
          <p className="text-sm text-muted-foreground">
            Please login to your account
          </p>

          <form onSubmit={(e) => {e.preventDefault(); form.handleSubmit(onSubmit)(e)}} className="w-full">
          <FieldSet className="w-full">
            <FieldGroup>

            <Field>
              <FieldLabel htmlFor="identifier">Role</FieldLabel>
              <Select
                value={form.watch("identifier")}
                onValueChange={(value) =>{
                    form.setValue(
                        "identifier",
                        value as "CUSTOMER" | "WORKER" | "ADMIN"
                      )
                      setRole(value as "CUSTOMER" | "WORKER" | "ADMIN");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                    {/* <SelectItem value="selectStatus">Select Status...</SelectItem> */}
                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                  <SelectItem value="WORKER">Worker</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={form.formState.errors.identifier?.message ? [{ message: form.formState.errors.identifier?.message }] : undefined}></FieldError>
            </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input {...form.register("email")} id="email" type="text" placeholder="example@gmail.com" />
              <FieldError errors={form.formState.errors.email?.message ? [{ message: form.formState.errors.email?.message }] : undefined}></FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input {...form.register("password")} id="password" type="password" placeholder="••••••••" />
              <FieldError errors={form.formState.errors.password?.message ? [{ message: form.formState.errors.password?.message }] : undefined}></FieldError>

              <p className="text-sm text-muted-foreground"><Link href="/forgot-password" className="text-primary hover:underline">Forgot password?</Link></p>
              </Field>

            </FieldGroup>
          </FieldSet>

            
             <Button className="w-full mt-4 cursor-pointer text-md bg-orange-500 hover:bg-orange-600 text-white" type="submit">
                Login
              </Button>
          </form>

              <Button className="w-full mt-1 cursor-pointer bg-white text-black border-2 border-border hover:bg-gray-100" onClick={loginWithGoogle}>
              <FcGoogle className="size-6"/>
                <span className="text-md">Login with Google</span>
              </Button>
              <p className="text-sm text-muted-foreground mt-2 text-center">Don&apos;t have an account? <Link href="/signup" className="text-blue-500 hover:underline">Sign up</Link></p>
        </div>
   
    </div>
  );
}
