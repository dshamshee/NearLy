"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { User } from "@/types/user";
import { verifyEmail } from "@/actions/verifyEmail";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  zodForgotEmail,
  zodForgotEmailType,
  zodForgotReset,
  zodForgotResetType,
} from "@/zod/zodForgotPassword";
import axios from "axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

type ForgotPasswordStep = "email" | "reset";

function profileInitials(name: string, email: string) {
  const n = name?.trim();
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  }
  return email?.slice(0, 2).toUpperCase() || "?";
}

function roleLabel(role: User["role"]) {
  switch (role) {
    case "CUSTOMER":
      return "Customer";
    case "WORKER":
      return "Worker";
    case "ADMIN":
      return "Admin";
    default:
      return role;
  }
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const emailForm = useForm<zodForgotEmailType>({
    resolver: zodResolver(zodForgotEmail),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<zodForgotResetType>({
    resolver: zodResolver(zodForgotReset),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onVerifyEmail = async (data: zodForgotEmailType) => {
    setIsSubmitting(true)
    try {
      const result = await verifyEmail(data.email);
      if (result.success) {
        toast.success(result.message);
        setUser(JSON.parse(result.data as string) as User);
        setStep("reset");
      } else {
        toast.error(result.message);
        setUser(null);
      }
    } catch {
      toast.error("An error occurred during email verification");
    }finally{
        setIsSubmitting(false);
    }
  };

  const onUpdatePassword = async (data: zodForgotResetType) => {
    void data;
    try {
        setIsSubmitting(true)
        // call the api for updating the password
        const response = await axios.post('/api/forgot-password', {
          email: user?.email,
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
    
        if(response.data.success){
            toast.success(response.data.message);
            console.log(response.data);
            router.push('/login');
        }
        else{
            toast.error(response.data.message);
        }
    } catch (error) {
        if(error instanceof AxiosError) toast.error(error.response?.data.message || "An error occurred during password update");
        else toast.error("Something went wrong");
        toast.error("An error occurred during password update");
    }finally{
        setIsSubmitting(false);
    }



  };

  return (
    <div className="mainContainer min-h-screen p-4 flex flex-col items-center justify-center bg-background">
      <h1 className="text-2xl font-bold text-foreground">
        <span className="text-muted-foreground">Near</span>
        <span className="text-orange-500">Ly</span>
      </h1>
      <div className="w-full max-w-md border-2 border-border flex flex-col gap-2 justify-center items-center mt-4 p-4 rounded-md">
        {step === "email" ? (
          <>
            <p className="text-sm text-muted-foreground text-center">
              Enter your email. We&apos;ll verify it before you set a new
              password.
            </p>
            <form
              className="w-full"
              onSubmit={(e) => {
                e.preventDefault();
                emailForm.handleSubmit(onVerifyEmail)(e);
              }}
            >
              <FieldSet className="w-full">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
                    <Input
                      id="forgot-email"
                      type="email"
                      autoComplete="email"
                      placeholder="example@gmail.com"
                      {...emailForm.register("email")}
                    />
                    <FieldError
                      errors={
                        emailForm.formState.errors.email?.message
                          ? [
                              {
                                message:
                                  emailForm.formState.errors.email.message,
                              },
                            ]
                          : undefined
                      }
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <Button
                type="submit"
                className="w-full mt-4 cursor-pointer text-md bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Continue"}
              </Button>
            </form>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground text-center">
              Email verified. Enter your current password and choose a new one.
            </p>
            {user && (
              <div className="w-full rounded-lg border border-border bg-muted/40 p-4 flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Avatar className="size-16 shrink-0 ring-2 ring-border">
                  {user.avatar ? (
                    <AvatarImage
                      src={user.avatar}
                      alt=""
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="text-lg font-semibold bg-orange-500/15 text-orange-700 dark:text-orange-400">
                    {profileInitials(user.name, user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 text-center sm:text-left space-y-1">
                  <p className="font-semibold text-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.email}
                  </p>
                  <p className="pt-1">
                    <span className="inline-flex items-center rounded-md border border-border bg-background px-2 py-0.5 text-xs font-medium text-foreground">
                      {roleLabel(user.role)}
                    </span>
                  </p>
                </div>
              </div>
            )}
            <form
              className="w-full"
              onSubmit={(e) => {
                e.preventDefault();
                resetForm.handleSubmit(onUpdatePassword)(e);
              }}
            >
              <FieldSet className="w-full">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="old-password">Old password</FieldLabel>
                    <div className="relative">
                      <Input
                        id="old-password"
                        type={showOldPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="pr-10"
                        {...resetForm.register("oldPassword")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        aria-label={
                          showOldPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showOldPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <FieldError
                      errors={
                        resetForm.formState.errors.oldPassword?.message
                          ? [
                              {
                                message:
                                  resetForm.formState.errors.oldPassword
                                    .message,
                              },
                            ]
                          : undefined
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="new-password">New password</FieldLabel>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        className="pr-10"
                        {...resetForm.register("newPassword")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        aria-label={
                          showNewPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <FieldError
                      errors={
                        resetForm.formState.errors.newPassword?.message
                          ? [
                              {
                                message:
                                  resetForm.formState.errors.newPassword
                                    .message,
                              },
                            ]
                          : undefined
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm new password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        className="pr-10"
                        {...resetForm.register("confirmPassword")}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <FieldError
                      errors={
                        resetForm.formState.errors.confirmPassword?.message
                          ? [
                              {
                                message:
                                  resetForm.formState.errors.confirmPassword
                                    .message,
                              },
                            ]
                          : undefined
                      }
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <Button
                type="submit"
                className="w-full mt-4 cursor-pointer text-md bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Update password"}
              </Button>
            </form>
          </>
        )}

        <p className="text-sm text-muted-foreground mt-2 text-center">
          <Link href="/login" className="text-blue-500 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
