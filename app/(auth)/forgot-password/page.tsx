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
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zodForgotEmail, zodForgotEmailType } from "@/zod/zodForgotPassword";
import axios, { AxiosError } from "axios";

type Step = "email" | "sendEmail";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailForm = useForm<zodForgotEmailType>({
    resolver: zodResolver(zodForgotEmail),
    defaultValues: { email: "" },
  });

  const onLookupAccount = async (data: zodForgotEmailType) => {
    try {
      setIsSubmitting(true);
      const res = await axios.post(
        "/api/forgot-password/lookup",
        { email: data.email.trim() },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setStep("sendEmail");
      } else {
        toast.error(res.data.message ?? "Could not find account");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ?? "No account found with this email"
        );
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSendEmail = async () => {
    try {
      setIsSubmitting(true);
      const res = await axios.post(
        "/api/forgot-password/send-email",
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ?? "Could not send email"
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
        {step === "email" ? (
          <>
            <div className="w-full text-center space-y-1">
              <h2 className="text-lg font-semibold text-foreground">
                Forgot password
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter the email you use for NearLy. We&apos;ll look up your
                account and then you can request a reset link.
              </p>
            </div>
            <form
              className="w-full"
              onSubmit={(e) => {
                e.preventDefault();
                emailForm.handleSubmit(onLookupAccount)(e);
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
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Find account"
                )}
              </Button>
            </form>
          </>
        ) : (
          <>
            <div className="w-full text-center space-y-2">
              <h2 className="text-lg font-semibold text-foreground">
                Account found
              </h2>
              <p className="text-sm text-muted-foreground">
                We&apos;ll email you a secure link to set a new password. The
                link expires in 10 minutes. Your session on this device also
                expires in 10 minutes.
              </p>
            </div>
            <Button
              type="button"
              variant="default"
              className="w-full cursor-pointer text-md bg-orange-500 hover:bg-orange-600 text-white gap-2"
              disabled={isSubmitting}
              onClick={onSendEmail}
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <Mail className="size-4" />
                  Send reset email
                </>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              After you receive the email, open the link to choose a new
              password.
            </p>
            <Link
              href="/forgot-password/complete"
              className="text-sm text-center text-blue-500 hover:underline"
            >
              Set new password on this device (same browser)
            </Link>
          </>
        )}

        <p className="text-sm text-muted-foreground text-center pt-2 border-t border-border w-full">
          <Link href="/login" className="text-blue-500 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
