'use client';

import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel, FieldContent, FieldGroup, FieldSet, FieldLegend, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Worker, WorkerProfessions } from "@/types/worker";
import { User as UserIcon, Phone, Mail, CreditCard, Briefcase, Award, DollarSign, Edit3, ShieldCheck, Sparkles, ArrowLeft } from "lucide-react";
import { editWorkerDetails, EditWorkerDetailsType } from "@/zod/editWorkerDetails";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";



export interface WorkerDetailsType extends Omit<Worker, "userId"> {
    userId: {
        name: string;
        email: string;
        avatar?: string; 
        role?: "CUSTOMER" | "WORKER" | "ADMIN";
        phone?: string;
    }
}


export default function WorkerProfileEdit({details}: {details: WorkerDetailsType}) {

    const router = useRouter();

    const form = useForm<EditWorkerDetailsType>({
        resolver: zodResolver(editWorkerDetails),
        defaultValues: {
            // email: "abc@gmail.com",
            name: details?.userId?.name || "",
            phone: details?.userId?.phone || "",
            profession: details?.profession || WorkerProfessions.OTHER,
            otherProfession: details?.otherProfession || "",
            proficienciyLevel: details?.proficienciyLevel || "INTERMEDIATE",
            workExperience: details?.workExperience || "3 YEARS",
            serviceCharge: details?.serviceCharge || 500,
            aadharNumber: details?.aadharNumber || "",
        },
    });

    // Watch profession to conditionally show otherProfession field
    const profession = useWatch({
        control: form.control,
        name: "profession",
    });

    const onSubmit = async (data: EditWorkerDetailsType) => {
        try {
            console.log("Form Data:", data);
            const response = await axios.post("/api/worker/update-profile", data);
            console.log('response', response.data)
            if(!response.data.success) {
                toast.error(response.data.message);
            } else {
                toast.success(response.data.message);
                router.push("/w/dashboard");
            }
        } catch (error: unknown) {
            console.error("Error updating profile:", error);
            if (error instanceof AxiosError && error.response?.data?.message) {
                toast.error(error.response.data.message as string);
            } else {
                toast.error("Failed to update profile. Please try again.");
            }
        }
    };

    return (
        <div className="mainContainer min-h-screen bg-gradient-to-br from-background via-background to-accent/20 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Enhanced Header */}
                <div className="mb-10">
                    <span><Link href={"/w/dashboard"} className="text-sm text-muted-foreground hover:text-foreground flex items-center transition-colors"><ArrowLeft className="size-4 mr-2" /> Back to Dashboard</Link></span>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                            <Edit3 className="size-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-foreground tracking-tight">Edit Worker Profile</h1>
                            <p className="text-muted-foreground mt-1.5 text-base">
                                Complete your profile to start receiving bookings and grow your business
                            </p>
                        </div>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mt-6" />
                </div>


                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Information Section */}
                    <FieldSet className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <UserIcon className="size-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <FieldLegend variant="legend" className="text-xl font-semibold mb-0">
                                Personal Information
                            </FieldLegend>
                        </div>

                        <FieldGroup className="gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Field>
                                    <FieldLabel htmlFor="name" className="text-sm font-medium">
                                        <UserIcon className="size-4" />
                                        Full Name
                                    </FieldLabel>
                                    <FieldContent>
                                        <Input
                                            id="name"
                                            type="text"
                                            {...form.register("name")}
                                            // value={workerDetails?.userId?.name|| ""}
                                            placeholder="Enter your full name"
                                            className="h-11"
                                        />
                                        <FieldError
                                            errors={
                                                form.formState.errors.name?.message
                                                    ? [{ message: form.formState.errors.name.message }]
                                                    : undefined
                                            }
                                        />
                                    </FieldContent>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="phone" className="text-sm font-medium">
                                        <Phone className="size-4" />
                                        Phone Number
                                    </FieldLabel>
                                    <FieldContent>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            {...form.register("phone")}
                                            // value={workerDetails?.userId?.phone || ""}
                                            placeholder="+91 9876543210"
                                            className="h-11"
                                        />
                                        <FieldError
                                            errors={
                                                form.formState.errors.phone?.message
                                                    ? [{ message: form.formState.errors.phone.message }]
                                                    : undefined
                                            }
                                        />
                                    </FieldContent>
                                </Field>
                            </div>

                            <Field>
                                <FieldLabel htmlFor="email" className="text-sm font-medium">
                                    <Mail className="size-4" />
                                    Email Address
                                </FieldLabel>
                                <FieldContent>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={details?.userId?.email || ""}
                                        placeholder="example@email.com"
                                        disabled
                                        className="h-11 bg-muted/50"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1.5">
                                        Email cannot be changed
                                    </p>
                                </FieldContent>
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    {/* Professional Information Section */}
                    <FieldSet className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                <Briefcase className="size-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <FieldLegend variant="legend" className="text-xl font-semibold mb-0">
                                Professional Information
                            </FieldLegend>
                        </div>

                        <FieldGroup className="gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Field>
                                    <FieldLabel htmlFor="profession" className="text-sm font-medium">
                                        <Briefcase className="size-4" />
                                        Profession
                                    </FieldLabel>
                                    <FieldContent>
                                        <Controller
                                            name="profession"
                                            control={form.control}
                                            render={({ field }) => (
                                                <Select
                                                    value={field.value}
                                                    onValueChange={(value) => {
                                                        field.onChange(value as WorkerProfessions);
                                                        // Clear otherProfession when profession changes
                                                        if (value !== WorkerProfessions.OTHER) {
                                                            form.setValue("otherProfession", "");
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger id="profession" className="w-full h-11">
                                                        <SelectValue placeholder="Select your profession" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.values(WorkerProfessions).map((profession) => (
                                                            <SelectItem key={profession} value={profession}>
                                                                {profession.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        <FieldError
                                            errors={
                                                form.formState.errors.profession?.message
                                                    ? [{ message: form.formState.errors.profession.message }]
                                                    : undefined
                                            }
                                        />
                                    </FieldContent>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="proficiencyLevel" className="text-sm font-medium">
                                        <Award className="size-4" />
                                        Proficiency Level
                                    </FieldLabel>
                                    <FieldContent>
                                        <Controller
                                            name="proficienciyLevel"
                                            control={form.control}
                                            render={({ field }) => (
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger id="proficiencyLevel" className="w-full h-11">
                                                        <SelectValue placeholder="Select proficiency level" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="BEGINNER">Beginner</SelectItem>
                                                        <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                                                        <SelectItem value="EXPERT">Expert</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        <FieldError
                                            errors={
                                                form.formState.errors.proficienciyLevel?.message
                                                    ? [{ message: form.formState.errors.proficienciyLevel.message }]
                                                    : undefined
                                            }
                                        />
                                    </FieldContent>
                                </Field>
                            </div>

                            {profession === WorkerProfessions.OTHER && (
                                <Field>
                                    <FieldLabel htmlFor="otherProfession" className="text-sm font-medium">
                                        <Sparkles className="size-4" />
                                        Specify Other Profession
                                    </FieldLabel>
                                    <FieldContent>
                                        <Input
                                            id="otherProfession"
                                            type="text"
                                            {...form.register("otherProfession")}
                                            placeholder="Enter your profession"
                                            className="h-11"
                                        />
                                        <FieldError
                                            errors={
                                                form.formState.errors.otherProfession?.message
                                                    ? [{ message: form.formState.errors.otherProfession.message }]
                                                    : undefined
                                            }
                                        />
                                    </FieldContent>
                                </Field>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Field>
                                    <FieldLabel htmlFor="workExperience" className="text-sm font-medium">
                                        Work Experience
                                    </FieldLabel>
                                    <FieldContent>
                                        <Controller
                                            name="workExperience"
                                            control={form.control}
                                            render={({ field }) => (
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger id="workExperience" className="w-full h-11">
                                                        <SelectValue placeholder="Select work experience" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1 YEAR">1 Year</SelectItem>
                                                        <SelectItem value="2 YEARS">2 Years</SelectItem>
                                                        <SelectItem value="3 YEARS">3 Years</SelectItem>
                                                        <SelectItem value="4 YEARS">4 Years</SelectItem>
                                                        <SelectItem value="5 YEARS">5 Years</SelectItem>
                                                        <SelectItem value="MORE THAN 5 YEARS">More than 5 Years</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        <FieldError
                                            errors={
                                                form.formState.errors.workExperience?.message
                                                    ? [{ message: form.formState.errors.workExperience.message }]
                                                    : undefined
                                            }
                                        />
                                    </FieldContent>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="serviceCharge" className="text-sm font-medium">
                                        <DollarSign className="size-4" />
                                        Service Charge (₹)
                                    </FieldLabel>
                                    <FieldContent>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                                                ₹
                                            </span>
                                            <Input
                                                id="serviceCharge"
                                                type="number"
                                                {...form.register("serviceCharge", {
                                                    valueAsNumber: true,
                                                })}
                                                placeholder="500"
                                                min="0"
                                                className="h-11 pl-8"
                                            />
                                        </div>
                                        <FieldError
                                            errors={
                                                form.formState.errors.serviceCharge?.message
                                                    ? [{ message: form.formState.errors.serviceCharge.message }]
                                                    : undefined
                                            }
                                        />
                                    </FieldContent>
                                </Field>
                            </div>
                        </FieldGroup>
                    </FieldSet>

                    {/* Verification Section */}
                    <FieldSet className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                            <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                                <ShieldCheck className="size-5 text-green-600 dark:text-green-400" />
                            </div>
                            <FieldLegend variant="legend" className="text-xl font-semibold mb-0">
                                Verification
                            </FieldLegend>
                        </div>

                        <FieldGroup className="gap-6">
                            <Field>
                                <FieldLabel htmlFor="aadharNumber" className="text-sm font-medium">
                                    <CreditCard className="size-4" />
                                    Aadhar Number
                                </FieldLabel>
                                <FieldContent>
                                    <Input
                                        id="aadharNumber"
                                        type="text"
                                        {...form.register("aadharNumber")}
                                        placeholder="1234 5678 9012"
                                        maxLength={14}
                                        className="h-11"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1.5">
                                        Enter your 12-digit Aadhar number for verification
                                    </p>
                                    <FieldError
                                        errors={
                                            form.formState.errors.aadharNumber?.message
                                                ? [{ message: form.formState.errors.aadharNumber.message }]
                                                : undefined
                                        }
                                    />
                                </FieldContent>
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    {/* Submit Button */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-border/50">
                        <p className="text-sm text-muted-foreground">
                            Make sure all information is accurate before saving
                        </p>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => form.reset()}
                                className="flex-1 sm:flex-initial min-w-[100px]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                className="flex-1 sm:flex-initial min-w-[140px] shadow-md hover:shadow-lg transition-shadow"
                            >
                                {form.formState.isSubmitting ? (
                                    <>
                                        <span className="animate-spin mr-2">⏳</span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="size-4 mr-2" />
                                        Save Profile
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}