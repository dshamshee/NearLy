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
import { Button } from "@/components/ui/button";
import { zodSignup, zodSignupType } from "@/zod/zodSignup";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios, { AxiosError } from 'axios'
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";


export default function SignupPage() {
    const router = useRouter();
    const [isHidden, setIsHidden] = useState<boolean>(true);
    const [verificationLoading, setVerificationLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<zodSignupType>({
    resolver: zodResolver(zodSignup),
    defaultValues: {
      name: "",
      email: "",
      verificationCode: "",
      password: "",
      confirmPassword: "",
      identifier: "CUSTOMER",
    },
  });

  const onSubmit = async (data: zodSignupType) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post('/api/signup', data);
      if(response.data.success){
        toast.success(response.data.message);
        router.push('/');
      }
 
    } catch (error) {
      if(error instanceof AxiosError) toast.error(error.response?.data.message || "An error occurred during signup");
      else toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleVerification = async ()=>{
   try {
    setVerificationLoading(true);
    const response = await axios.post('/api/email-verification', {
      email: form.getValues('email'),
      name: form.getValues('name'),
    })
    if(response.data.success){
      setIsHidden(false);
      setVerificationLoading(false);
      toast.success(response.data.message);
    }
    else{
      toast.error(response.data.message);
      setIsHidden(true);
    }
   } catch (error) {
    if(error instanceof AxiosError)
    toast.error(error.response?.data.message || "An error occurred during verification");
  else toast.error("Something went wrong");
   } finally {
    setVerificationLoading(false);
   }
  }

  return (
    <div className="mainContainer min-h-screen p-4 flex flex-col items-center justify-center bg-background">
      <h1 className="text-2xl font-bold text-foreground">
        Welcom to
        <span className="text-muted-foreground"> Near</span>
        <span className="text-orange-500">Ly</span>
      </h1>
      <div className="innerContainer w-full max-w-md border-2 border-border flex flex-col gap-2 justify-center items-center mt-4 p-4 rounded-md">
        <p className="text-sm text-muted-foreground">
          Create your account to get started
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
                <RadioGroup onValueChange={(value) => {
                  form.setValue("identifier", value as "CUSTOMER" | "WORKER");
                }} className="flex flex-row gap-2 mt-4 items-center justify-center" defaultValue="CUSTOMER">
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
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  {...form.register("name")}
                  id="name"
                  type="text"
                  placeholder="Your name"
                />
                <FieldError
                  errors={
                    form.formState.errors.name?.message
                      ? [{ message: form.formState.errors.name?.message }]
                      : undefined
                  }
                ></FieldError>
              </Field>

              <Field>
                <div className="flex flex-row items-center justify-between">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <button type="button" className="text-sm mr-4 text-muted-foreground hover:text-orange-500 cursor-pointer" onClick={handleVerification}>
                  {verificationLoading ? <Loader2 className="size-4 animate-spin" /> : (isHidden ? "Verify" : "Resend Code")}
                </button>
                </div>
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

              <Field className={`${isHidden ? "hidden" : ""}`}>
                <FieldLabel htmlFor="verificationCode">OTP</FieldLabel>
                <Input
                  {...form.register("verificationCode")}
                  id="verificationCode"
                  type="number"
                  placeholder="6 digits code"
                />
                <FieldError
                  errors={
                    form.formState.errors.verificationCode?.message
                      ? [{ message: form.formState.errors.verificationCode?.message }]
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
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                <div className="relative">
                  <Input
                    {...form.register("confirmPassword")}
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
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
                      ? [{ message: form.formState.errors.confirmPassword?.message }]
                      : undefined
                  }
                ></FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>

          <Button
            className="w-full mt-4 cursor-pointer text-md bg-orange-500 hover:bg-orange-600 text-white"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Signup"}
          </Button>
        </form>
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
