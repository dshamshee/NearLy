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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zodForgotReset, zodForgotResetType } from "@/zod/zodForgotPassword";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ResetPasswordPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useForm<zodForgotResetType>({
    resolver: zodResolver(zodForgotReset),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const dashboardHref =
    session?.user?.role === "WORKER" ? "/w/dashboard" : "/c/dashboard";

  const onUpdatePassword = async (data: zodForgotResetType) => {
    const email = session?.user?.email;
    if (!email) {
      toast.error("You must be signed in to reset your password.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        "/api/forgot-password",
        {
          email,
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        router.push(dashboardHref);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ??
            "An error occurred while updating your password"
        );
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mainContainer min-h-screen p-4 flex flex-col items-center justify-center bg-background">
      <h1 className="text-2xl font-bold text-foreground">
        <span className="text-muted-foreground">Near</span>
        <span className="text-orange-500">Ly</span>
      </h1>
      <div className="w-full max-w-md border-2 border-border flex flex-col gap-4 justify-center items-center mt-4 p-6 rounded-md">
        <div className="w-full text-center space-y-1">
          <h2 className="text-lg font-semibold text-foreground">
            Reset password
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter your current password, then choose a new one.
          </p>
        </div>

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
                <FieldLabel htmlFor="old-password">Current password</FieldLabel>
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
                              resetForm.formState.errors.oldPassword.message,
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
                              resetForm.formState.errors.newPassword.message,
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
                      showConfirmPassword ? "Hide password" : "Show password"
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
            disabled={isSubmitting || status === "loading"}
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Update password"
            )}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center">
          <Link
            href={status === "authenticated" ? dashboardHref : "/login"}
            className="text-blue-500 hover:underline"
          >
            {status === "authenticated"
              ? "Back to dashboard"
              : "Back to login"}
          </Link>
        </p>
      </div>
    </div>
  );
}
