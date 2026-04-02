import { getWorkerDetails } from "@/actions/getWorkerDetails";
import { Button } from "@/components/ui/button";
import {
    User as UserIcon,
    Phone,
    Mail,
    Briefcase,
    Award,
    DollarSign,
    ShieldCheck,
    ArrowLeft,
    Edit3,
    Star,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { WorkerProfessions } from "@/types/worker";

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
            <div className="w-full min-h-screen mt-20 flex items-center justify-center bg-zinc-950">
                <div className="text-center">
                    <p className="text-red-400 font-medium">Error: {details.message}</p>
                    <Link href="/w/dashboard">
                        <Button variant="outline" className="mt-4 border-zinc-700 text-zinc-300 hover:bg-zinc-800">
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

    const professionDisplay = worker.profession
        ? formatProfession(worker.profession) +
          (worker.profession === WorkerProfessions.OTHER && worker.otherProfession
              ? ` · ${worker.otherProfession}`
              : "")
        : null;

    return (
        <div className="w-full min-h-screen mt-20 bg-zinc-950 text-zinc-100 overflow-auto">
            {/* Back link - fixed top left */}
            <Link
                href="/w/dashboard"
                className="fixed top-6 left-6 z-20 flex items-center gap-2 text-zinc-500 hover:text-zinc-100 transition-colors duration-300 text-sm"
            >
                <ArrowLeft className="size-4" />
                Dashboard
            </Link>

            {/* Cover section - full width gradient */}
            <section className="relative w-full h-48 sm:h-56 overflow-hidden">
                <div
                    className="absolute inset-0 bg-linear-to-br from-amber-600/80 via-orange-600/60 to-rose-700/70"
                    aria-hidden
                />
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                    aria-hidden
                />
            </section>

            {/* Profile content - overlaps cover */}
            <div className="relative -mt-20 px-4 sm:px-6 lg:px-8 pb-16 max-w-6xl mx-auto">
                {/* Avatar + name block */}
                <div className="flex flex-col sm:flex-row sm:items-end gap-6 mb-10">
                    <div className="relative shrink-0">
                        {user?.avatar ? (
                            <div className="relative size-32 sm:size-40 rounded-2xl overflow-hidden ring-4 ring-zinc-950 shadow-2xl">
                                <Image
                                    src={user.avatar}
                                    alt={user?.name ?? "Profile"}
                                    fill
                                    className="object-cover"
                                    sizes="160px"
                                    priority
                                />
                            </div>
                        ) : (
                            <div className="size-32 sm:size-40 rounded-2xl bg-zinc-800 ring-4 ring-zinc-950 flex items-center justify-center">
                                <UserIcon className="size-16 sm:size-20 text-zinc-500" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 pb-1">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                            {user?.name ?? "Worker"}
                        </h1>
                        {professionDisplay && (
                            <p className="text-amber-400/90 font-medium mt-1 text-lg">{professionDisplay}</p>
                        )}
                        <p className="text-zinc-500 mt-1">{user?.email}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-4">
                            {worker.averageRating != null && worker.averageRating > 0 && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium">
                                    <Star className="size-4 fill-amber-400" />
                                    {worker.averageRating.toFixed(1)}
                                </span>
                            )}
                            {worker.totalBookings != null && worker.totalBookings > 0 && (
                                <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-sm">
                                    {worker.totalBookings} booking{worker.totalBookings !== 1 ? "s" : ""}
                                </span>
                            )}
                            {worker.serviceCharge != null && worker.serviceCharge > 0 && (
                                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                                    ₹{worker.serviceCharge}/service
                                </span>
                            )}
                        </div>
                        <Link href="/w/profile/edit" className="inline-block mt-5">
                            <Button
                                size="sm"
                                className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold gap-2 rounded-lg transition-all duration-300 hover:scale-105"
                            >
                                <Edit3 className="size-4" />
                                Edit Profile
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Bento grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Contact - spans 2 on lg */}
                    <BentoPanel className="lg:col-span-2" title="Contact">
                        <div className="space-y-4">
                            <InfoLine icon={<UserIcon className="size-4" />} label="Name" value={user?.name} />
                            <InfoLine icon={<Mail className="size-4" />} label="Email" value={user?.email} />
                            <InfoLine icon={<Phone className="size-4" />} label="Phone" value={user?.phone} />
                        </div>
                    </BentoPanel>

                    {/* Professional */}
                    <BentoPanel title="Professional">
                        <div className="space-y-4">
                            <InfoLine
                                icon={<Briefcase className="size-4" />}
                                label="Profession"
                                value={professionDisplay}
                            />
                            <InfoLine
                                icon={<Award className="size-4" />}
                                label="Level"
                                value={worker.proficienciyLevel ? formatProficiency(worker.proficienciyLevel) : undefined}
                            />
                            <InfoLine
                                icon={<DollarSign className="size-4" />}
                                label="Experience"
                                value={worker.workExperience ? formatExperience(worker.workExperience) : undefined}
                            />
                            <InfoLine
                                icon={<DollarSign className="size-4" />}
                                label="Rate"
                                value={worker.serviceCharge != null ? `₹${worker.serviceCharge}` : undefined}
                            />
                        </div>
                    </BentoPanel>

                    {/* Verification */}
                    <BentoPanel className="lg:col-span-2" title="Verification">
                        <div className="flex flex-wrap items-center gap-6">
                            <div>
                                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Aadhar</p>
                                <p className="font-mono text-zinc-300">
                                    {maskAadhar(worker.aadharNumber)}
                                    {worker.isAadharVerified && (
                                        <span className="ml-2 text-emerald-400 text-sm font-medium">Verified</span>
                                    )}
                                </p>
                            </div>
                            {worker.totalEarnings != null && worker.totalEarnings > 0 && (
                                <div>
                                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                                        Total Earnings
                                    </p>
                                    <p className="font-mono text-emerald-400 text-lg font-semibold">
                                        ₹{worker.totalEarnings.toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </BentoPanel>

                    {/* Quick stat card */}
                    <BentoPanel title="Status" className="flex flex-col justify-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/20">
                                <ShieldCheck className="size-6 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm text-zinc-500">Profile</p>
                                <p className="font-semibold text-white">
                                    {worker.isProfileCompleted ? "Complete" : "Incomplete"}
                                </p>
                            </div>
                        </div>
                    </BentoPanel>
                </div>
            </div>
        </div>
    );
}

function BentoPanel({
    title,
    children,
    className = "",
}: {
    title: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`group rounded-xl border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-sm p-6 transition-all duration-500 hover:border-zinc-700 hover:bg-zinc-900/70 ${className}`}
        >
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">{title}</h3>
            {children}
        </div>
    );
}

function InfoLine({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value?: string | null;
}) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3 group/item">
            <span className="text-zinc-600 mt-0.5 group-hover/item:text-amber-500/80 transition-colors">{icon}</span>
            <div>
                <p className="text-xs text-zinc-500">{label}</p>
                <p className="text-zinc-200 font-medium">{value}</p>
            </div>
        </div>
    );
}
