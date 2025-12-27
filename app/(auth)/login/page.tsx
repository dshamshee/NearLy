"use client";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { zodLogin, zodLoginType } from "@/zod/zodLogin";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { signInWithRole } from "@/utils/authHelpers";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";


export default function LoginPage() {
  // const { data: session } = useSession();
  // console.log("session in login page", session);

  const router = useRouter();
  const [role, setRole] = useState<"CUSTOMER" | "WORKER">("CUSTOMER");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Check for error in URL parameters after OAuth redirect completes
  useEffect(() => {
    // Wait for component to be fully mounted and Toaster to be ready
    const timeoutId = setTimeout(() => {
      if (typeof window === "undefined") return;
      
      const params = new URLSearchParams(window.location.search);
      const error = params.get("error");
      
      if (error) {
        console.log("Error detected in URL:", error);
        
        // NextAuth uses "AccessDenied" error code when signIn callback throws an error
        if (error === "AccessDenied") {
          console.log("Showing AccessDenied toast");
          // Use a small delay to ensure Toaster is ready
          setTimeout(() => {
            toast.error("User already exists with a different role.", {
              duration: 5000,
              position: "top-center",
              description: "Please select the correct role or use email/password login. If you are a new user, please sign up with the correct role.",
            });
          }, 50);
        } else {
          // Handle other NextAuth errors
          const errorMessages: Record<string, string> = {
            "Configuration": "There is a problem with the server configuration.",
            "Verification": "The verification token has expired or has already been used.",
            "Default": "Something went wrong. Please check your details and try again.",
          };
          const errorMessage = errorMessages[error] || errorMessages["Default"];
          console.log("Showing error toast:", errorMessage);
          setTimeout(() => {
            toast.error(errorMessage, {
              duration: 5000,
              position: "top-center",
              className: "text-center",
            });
          }, 50);
        }
        
        // Clean up URL by removing error parameter
        params.delete("error");
        const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
        window.history.replaceState({}, "", newUrl);
      }
    }, 300); // Wait 300ms for everything to be ready
    
    return () => clearTimeout(timeoutId);
  }, []);

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
    setIsSubmitting(true);
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        identifier: data.identifier,
        redirect: false, // Prevent automatic redirect on error
      });

      if(result?.ok){
        toast.success("Login Successful");
        router.push("/");
      } else toast.error(result?.error || "Login Failed");
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally{
      setIsSubmitting(false);
    }
  };

  const loginWithGoogle = async () => {
    // console.log("role", role);
    try {
      await signInWithRole("google", role, "/");
      // Errors will be handled via URL parameters in useEffect
    } catch (error) {
      toast.error( error instanceof Error ? error.message : "An error occurred during login");
    }
  };

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

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(onSubmit)(e);
          }}
          className="w-full"
        >
          <FieldSet className="w-full">
            <FieldGroup>
              <Field>
                <RadioGroup
                  onValueChange={(value) => {
                    form.setValue("identifier", value as "CUSTOMER" | "WORKER");
                    setRole(value as "CUSTOMER" | "WORKER");
                  }}
                  className="flex flex-row gap-2 mt-4 items-center justify-center"
                  defaultValue="CUSTOMER"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="CUSTOMER" id="CUSTOMER" />
                    <Label htmlFor="CUSTOMER">Customer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="WORKER" id="WORKER" />
                    <Label htmlFor="WORKER">Worker</Label>
                  </div>
                </RadioGroup>
                <FieldError
                  errors={
                    form.formState.errors.identifier?.message
                      ? [{ message: form.formState.errors.identifier?.message }]
                      : undefined
                  }
                ></FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...form.register("email")}
                  id="email"
                  type="text"
                  placeholder="example@gmail.com"
                />
                <FieldError
                  errors={
                    form.formState.errors.email?.message
                      ? [{ message: form.formState.errors.email?.message }]
                      : undefined
                  }
                ></FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    {...form.register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <FieldError
                  errors={
                    form.formState.errors.password?.message
                      ? [{ message: form.formState.errors.password?.message }]
                      : undefined
                  }
                ></FieldError>

                <p className="text-sm text-muted-foreground">
                  <Link
                    href="/forgot-password"
                    className="text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </p>
              </Field>
            </FieldGroup>
          </FieldSet>

          <Button
            disabled={isSubmitting}
            className="w-full mt-4 cursor-pointer text-md bg-orange-500 hover:bg-orange-600 text-white"
            type="submit"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <span>Login</span>
            )}
          </Button>
        </form>

        <Button
          className="w-full mt-1 cursor-pointer bg-white text-black border-2 border-border hover:bg-gray-100"
          onClick={loginWithGoogle}
        >
          <FcGoogle className="size-6" />
          <span className="text-md">Login with Google</span>
        </Button>
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
