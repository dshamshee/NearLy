"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
    User as UserIcon,
    Mail,
    Phone,
    Calendar,
    Briefcase,
    ChevronRight,
    Clock,
    CheckCircle2,
    XCircle,
    Loader2,
    AlertCircle,
    Lock,
    ArrowRight,
} from "lucide-react";
import { EditableAvatar } from "@/components/editable-avatar";
import { EditProfileDialog } from "@/components/edit-profile-dialog";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "./ui/button";

type Tab = "details" | "bookings";

interface Customer {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    role: string;
    createdAt?: Date;
}

interface Booking {
    _id: string;
    bookingDate: string;
    bookingTime: string;
    bookingStatus: string;
    workNeededDescription: string;
    workNeededProfession: string;
    isWorkCompleted?: boolean;
    workerId?: { name?: string; avatar?: string };
}

interface CustomerProfileTabsProps {
    customer: Customer;
    bookings: Booking[];
    isOwnProfile: boolean;
    customerId: string;
}

const completedCount = (bookings: Booking[]) =>
    bookings.filter((b) => b.bookingStatus === "COMPLETED").length;

const statusConfig: Record<string, { icon: typeof CheckCircle2; label: string; className: string }> = {
    PENDING: { icon: Clock, label: "Pending", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
    ACCEPTED: { icon: Loader2, label: "Accepted", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
    REJECTED: { icon: XCircle, label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
    CANCELLED: { icon: XCircle, label: "Cancelled", className: "bg-muted text-muted-foreground border-border" },
    COMPLETED: { icon: CheckCircle2, label: "Completed", className: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" },
};

function formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function formatTime(date: string | Date) {
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatProfession(value: string) {
    return value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export function CustomerProfileTabs({
    customer,
    bookings,
    isOwnProfile,
    customerId,
}: CustomerProfileTabsProps) {
    const [activeTab, setActiveTab] = useState<Tab>("details");

    const formatRole = (role: string) =>
        role.charAt(0) + role.slice(1).toLowerCase();

    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xl mb-8"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
                <div className="relative px-6 sm:px-8 py-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className="shrink-0"
                        >
                            {isOwnProfile ? (
                                <EditableAvatar
                                    avatar={customer.avatar}
                                    name={customer.name}
                                    size={112}
                                    className="ring-4 ring-primary/10"
                                />
                            ) : customer.avatar ? (
                                <div className="relative size-28 rounded-full overflow-hidden ring-4 ring-primary/10">
                                    <Image
                                        src={customer.avatar}
                                        alt={customer.name}
                                        fill
                                        className="object-cover"
                                        sizes="112px"
                                    />
                                </div>
                            ) : (
                                <div className="size-28 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/10">
                                    <UserIcon className="size-14 text-primary" />
                                </div>
                            )}
                        </motion.div>
                        <div className="flex-1 text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                                <motion.h1
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2, duration: 0.3 }}
                                    className="text-2xl sm:text-3xl font-bold text-foreground"
                                >
                                    {customer.name}
                                </motion.h1>
                                {isOwnProfile && (
                                    <EditProfileDialog
                                        customerId={customerId}
                                        initialData={{
                                            name: customer.name,
                                            phone: customer.phone,
                                            avatar: customer.avatar,
                                        }}
                                    />
                                )}
                            </div>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                            >
                                {formatRole(customer.role)}
                            </motion.span>

                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border/50 mb-6"
            >
                {[
                    { id: "details" as Tab, label: "Personal Details", icon: UserIcon },
                    { id: "bookings" as Tab, label: "My Bookings", icon: Briefcase },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
                            activeTab === tab.id
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        )}
                    >
                        <tab.icon className="size-4" />
                        {tab.label}
                        {tab.id === "bookings" && bookings.length > 0 && (
                            <span className="ml-1 px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-xs">
                                {bookings.length}
                            </span>
                        )}
                    </button>
                ))}
            </motion.div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
                {activeTab === "details" ? (
                    <motion.div
                        key="details"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                    >
                        {isOwnProfile && bookings.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-2 gap-4 mb-4"
                            >
                                <div className="rounded-xl border border-border/50 bg-card p-4 hover:border-primary/20 transition-colors">
                                    <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
                                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                                </div>
                                <div className="rounded-xl border border-border/50 bg-card p-4 hover:border-primary/20 transition-colors">
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {completedCount(bookings)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Completed</p>
                                </div>
                            </motion.div>
                        )}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ staggerChildren: 0.05 }}
                            className="rounded-xl border border-border/50 bg-card overflow-hidden divide-y divide-border/50"
                        >
                            {(
                                [
                                    { icon: Mail, label: "Email", value: customer.email },
                                    ...(customer.phone ? [{ icon: Phone, label: "Phone", value: customer.phone }] : []),
                                    { icon: Briefcase, label: "Account Type", value: formatRole(customer.role) },
                                    ...(customer.createdAt
                                        ? [{ icon: Calendar, label: "Member Since", value: formatDate(customer.createdAt) }]
                                        : []),
                                    {
                                        icon: Lock, label: "Security",
                                        value: <Link href="/reset-password" className="flex items-center gap-2 hover:text-red-500">
                                            Reset Password
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    },
                                ] as { icon: typeof Mail; label: string; value: string }[]
                            ).map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 * i }}
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors"
                                >
                                    <item.icon className="size-5 text-muted-foreground shrink-0" />
                                    <span className="text-sm text-muted-foreground w-36 shrink-0">{item.label}</span>
                                    <span className="font-medium text-foreground truncate">{item.value}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="bookings"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                    >
                        {bookings.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-16 px-6 rounded-xl border border-dashed border-border bg-muted/20"
                            >
                                <AlertCircle className="size-12 text-muted-foreground mb-4" />
                                <p className="text-lg font-medium text-foreground mb-1">No bookings yet</p>
                                <p className="text-sm text-muted-foreground text-center max-w-sm">
                                    When you book a service, your booking history will appear here.
                                </p>
                            </motion.div>
                        ) : (
                            <div className="space-y-3">
                                {bookings.map((booking, i) => {
                                    const config = statusConfig[booking.bookingStatus] ?? statusConfig.PENDING;
                                    const StatusIcon = config.icon;
                                    return (
                                        <motion.div
                                            key={booking._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.05 * i, duration: 0.3 }}
                                            className="group rounded-xl border border-border/50 bg-card overflow-hidden hover:shadow-md hover:border-primary/20 transition-all duration-300"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <span className="font-medium text-foreground">
                                                            {formatProfession(booking.workNeededProfession)}
                                                        </span>
                                                        <span
                                                            className={cn(
                                                                "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                                                config.className
                                                            )}
                                                        >
                                                            <StatusIcon
                                                                className={cn(
                                                                    "size-3.5",
                                                                    booking.bookingStatus === "ACCEPTED" && "animate-spin"
                                                                )}
                                                            />
                                                            {config.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        {booking.workNeededDescription}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="size-3.5" />
                                                            {formatDate(booking.bookingDate)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="size-3.5" />
                                                            {formatTime(booking.bookingTime)}
                                                        </span>
                                                        {booking.workerId?.name && (
                                                            <span className="flex items-center gap-1">
                                                                {booking.workerId.avatar ? (
                                                                    <Image
                                                                        src={booking.workerId.avatar}
                                                                        alt=""
                                                                        width={16}
                                                                        height={16}
                                                                        className="rounded-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <UserIcon className="size-3.5" />
                                                                )}
                                                                {booking.workerId.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <ChevronRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
