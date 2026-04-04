import { getWorkerDetails } from "@/actions/getWorkerDetails";
import { Button } from "@/components/ui/button";
import {
    User as UserIcon,
    Phone,
    Mail,
    Briefcase,
    Award,
    DollarSign,
    ArrowLeft,
    Edit3,
    Star,
    Calendar,
    CreditCard,
    Lock,
} from "lucide-react";
import Link from "next/link";
import { WorkerProfessions } from "@/types/worker";
import { EditableAvatar } from "@/components/editable-avatar";

function formatProfession(value: string): string {
    if (value === WorkerProfessions.OTHER) return "Other";
    return value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function formatProficiency(value: string): string {
    const map: Record<string, string> = {
        BEGINNER: "Beginner",
        INTERMEDIATE: "Intermediate",
        EXPERT: "Expert",
    };
    return map[value] ?? value;
}

function formatExperience(value: string): string {
    const map: Record<string, string> = {
        "1 YEAR": "1 Year",
        "2 YEARS": "2 Years",
        "3 YEARS": "3 Years",
        "4 YEARS": "4 Years",
        "5 YEARS": "5 Years",
        "MORE THAN 5 YEARS": "More than 5 Years",
    };
    return map[value] ?? value ?? "—";
}

function maskAadhar(value?: string): string {
    if (!value || value.length < 4) return "—";
    return `•••• •••• ${value.slice(-4)}`;
}

export default async function WorkerProfilePage() {
    const details = await getWorkerDetails();

    if (!details.success || !details.data) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <p className="text-destructive font-medium">Error: {details.message}</p>
                    <Link href="/w/dashboard">
                        <Button variant="outline" className="mt-4">
                            <ArrowLeft className="size-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const worker = details.data;
    const user = worker.userId as { name?: string; email?: string; avatar?: string; phone?: string; role?: string };

    const rows = [
        { label: "Full Name", value: user?.name ?? "—", icon: UserIcon },
        { label: "Email", value: user?.email ?? "—", icon: Mail },
        { label: "Phone", value: user?.phone ?? "—", icon: Phone },
        {
            label: "Profession",
            value: worker.profession
                ? formatProfession(worker.profession) +
                  (worker.profession === WorkerProfessions.OTHER && worker.otherProfession
                      ? ` (${worker.otherProfession})`
                      : "")
                : "—",
            icon: Briefcase,
        },
        {
            label: "Proficiency",
            value: worker.proficienciyLevel ? formatProficiency(worker.proficienciyLevel) : "—",
            icon: Award,
        },
        {
            label: "Experience",
            value: worker.workExperience ? formatExperience(worker.workExperience) : "—",
            icon: Calendar,
        },
        {
            label: "Service Charge",
            value: worker.serviceCharge != null ? `₹${worker.serviceCharge}` : "—",
            icon: DollarSign,
        },
        {
            label: "Aadhar",
            value: (
                <>
                    {maskAadhar(worker.aadharNumber)}
                    {worker.isAadharVerified && (
                        <span className="ml-2 text-xs font-medium text-green-600 dark:text-green-400">Verified</span>
                    )}
                </>
            ),
            icon: CreditCard,
        },
        ...(worker.totalEarnings != null && worker.totalEarnings > 0
            ? [
                  {
                      label: "Total Earnings",
                      value: `₹${worker.totalEarnings.toLocaleString()}`,
                      icon: DollarSign,
                  },
              ]
            : []),
    ];

    return (
        <div className="w-full min-h-screen bg-background mt-14">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    href="/w/dashboard"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground py-8 transition-colors"
                >
                    <ArrowLeft className="size-4" />
                    Back to Dashboard
                </Link>

                {/* Split layout: sidebar + content */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 pb-12">
                    {/* Left: Identity block */}
                    <aside className="lg:w-80 shrink-0">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                                <EditableAvatar
                                    avatar={user?.avatar}
                                    name={user?.name}
                                    size={96}
                                />
                                <h1 className="mt-4 text-xl font-semibold text-foreground">{user?.name ?? "Worker"}</h1>
                                <p className="text-sm text-muted-foreground mt-0.5 truncate max-w-full">
                                    {user?.email}
                                </p>
                                <div className="flex items-center gap-3 mt-3">
                                    {worker.averageRating != null && worker.averageRating > 0 && (
                                        <span className="inline-flex items-center gap-1 text-sm">
                                            <Star className="size-4 fill-amber-400 text-amber-400" />
                                            {worker.averageRating.toFixed(1)}
                                        </span>
                                    )}
                                    {worker.totalBookings != null && worker.totalBookings > 0 && (
                                        <span className="text-sm text-muted-foreground">
                                            {worker.totalBookings} booking{worker.totalBookings !== 1 ? "s" : ""}
                                        </span>
                                    )}
                                </div>
                                <Link href="/w/profile/edit" className="mt-4 w-full lg:w-auto">
                                    <Button variant="outline" size="sm" className="w-full cursor-pointer lg:w-auto gap-2">
                                        <Edit3 className="size-4" />
                                        Edit Profile
                                    </Button>
                                </Link>
                                <Link href="/reset-password" className="mt-4 w-full lg:w-auto">
                                    <Buon variant="outline" size="sm" className="w-full cursor-pointer lg:w-auto gap-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500">
                                        <Lock className="size-4" />
                                        Change Password
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Right: Data table */}
                    <main className="flex-1 min-w-0">
                        <div className="border border-border rounded-lg divide-y divide-border overflow-hidden bg-card">
                            {rows.map((row) => (
                                <div
                                    key={row.label}
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors"
                                >
                                    <row.icon className="size-4 text-muted-foreground shrink-0" />
                                    <span className="text-sm text-muted-foreground w-36 shrink-0">{row.label}</span>
                                    <span className="font-medium text-foreground truncate">{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
