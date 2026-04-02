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
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  zodForgotNewPasswordOnly,
  zodForgotNewPasswordOnlyType,
} from "@/zod/zodForgotPassword";
import axios, { AxiosError } from "axios";

function ForgotPasswordCompleteInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token");

  const tokenRef = useRef<string | null>(tokenFromUrl);
  useEffect(() => {
    if (tokenFromUrl) tokenRef.current = tokenFromUrl;
  }, [tokenFromUrl]);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [validating, setValidating] = useState(true);

  const form = useForm<zodForgotNewPasswordOnlyType>({
    resolver: zodResolver(zodForgotNewPasswordOnly),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (tokenFromUrl) {
        setValidating(true);
        try {
          const res = await axios.get("/api/forgot-password/validate-token", {
            params: { token: tokenFromUrl },
            withCredentials: true,
          });
          if (cancelled) return;
          if (res.data.success) {
            setSessionReady(true);
          } else {
            toast.error(res.data.message ?? "Invalid link");
            setSessionReady(false);
          }
        } catch {
          if (!cancelled) {
            toast.error("This reset link is invalid or has expired");
            setSessionReady(false);
          }
        } finally {
          if (!cancelled) setValidating(false);
        }
        return;
      }

      try {
        const res = await axios.get("/api/forgot-password/session", {
          withCredentials: true,
        });
        if (cancelled) return;
        setSessionReady(!!res.data.success);
      } catch {
        if (!cancelled) setSessionReady(false);
      } finally {
        if (!cancelled) setValidating(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tokenFromUrl, router]);

  const onSubmit = async (data: zodForgotNewPasswordOnlyType) => {
    try {
      setIsSubmitting(true);
      const token = tokenRef.current;
      const res = await axios.post(
        "/api/forgot-password/confirm-reset",
        {
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
          ...(token ? { token } : {}),
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        router.push("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ?? "Could not update password"
        );
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (validating) {
    return (
      <div className="mainContainer min-h-screen p-4 flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!sessionReady) {
    return (
      <div className="mainContainer min-h-screen p-4 flex flex-col items-center justify-center bg-background gap-4 max-w-md mx-auto text-center">
        <p className="text-muted-foreground">
          This reset link is invalid or has expired, or your session ended.
        </p>
        <Link href="/forgot-password" className="text-blue-500 hover:underline">
          Start over
        </Link>
      </div>
    );
  }

  return (
    <div className="mainContainer min-h-screen p-4 flex flex-col items-center justify-center bg-background">
      <h1 className="text-2xl font-bold text-foreground">
        <span className="text-muted-foreground">Near</span>
        <span className="text-orange-500">Ly</span>
      </h1>
      <div className="w-full max-w-md border-2 border-border flex flex-col gap-4 justify-center items-center mt-4 p-6 rounded-md">
        <div className="w-full text-center space-y-1">
          <h2 className="text-lg font-semibold text-foreground">
            Set a new password
          </h2>
          <p className="text-sm text-muted-foreground">
            Choose a strong password for your account.
          </p>
        </div>

        <form
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(onSubmit)(e);
          }}
        >
          <FieldSet className="w-full">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="new-password">New password</FieldLabel>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="pr-10"
                    {...form.register("newPassword")}
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
                    form.formState.errors.newPassword?.message
                      ? [
                          {
                            message: form.formState.errors.newPassword.message,
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
                    {...form.register("confirmPassword")}
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
                    form.formState.errors.confirmPassword?.message
                      ? [
                          {
                            message:
                              form.formState.errors.confirmPassword.message,
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
              "Save new password"
            )}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center">
          <Link href="/login" className="text-blue-500 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ForgotPasswordCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="mainContainer min-h-screen p-4 flex flex-col items-center justify-center bg-background gap-4">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ForgotPasswordCompleteInner />
    </Suspense>
  );
}
