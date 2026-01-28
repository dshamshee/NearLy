'use client';

import { updateWorkerStatus } from "@/actions/updateWorkerStatus";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, DollarSign, Briefcase, User, CheckCircle2, XCircle, Clock3 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Map } from "@/components/map";
import {
    Alert,
    AlertAction,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react"
import { getWorkerProfileStatus } from "@/actions/workerProfileStatus";
import Link from "next/link";




export default function WorkerDashboard() {
    const { data: session } = useSession();
    // const router  = useRouter();
    // Mock data for UI demonstration
    // const isActive = true;
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isBookingAccepted, setIsBookingAccepted] = useState<boolean>(false);
    const [latitude, setLatitude] = useState<number>(25.5941);
    const [longitude, setLongitude] = useState<number>(85.1376);
    const [isProfileCompleted, setIsProfileCompleted] = useState<boolean>(false);


    useEffect(() => {
        const getWorkerDetails = async () => {
            const response = await getWorkerProfileStatus();
            setIsProfileCompleted(response.data!)
        }
        getWorkerDetails();
    }, [session])



    const totalEarnings = 125000;
    const totalBookings = 47;

    const recentBookings = [
        {
            id: '1',
            customerName: 'John Doe',
            workDescription: 'Fix leaking pipe in kitchen',
            profession: 'Plumbing',
            bookingDate: '2024-01-15',
            bookingTime: '2024-01-15T10:00:00',
            status: 'CONFIRMED',
        },
        {
            id: '2',
            customerName: 'Jane Smith',
            workDescription: 'Install new electrical outlets',
            profession: 'Electrical',
            bookingDate: '2024-01-14',
            bookingTime: '2024-01-14T14:30:00',
            status: 'COMPLETED',
        },
        {
            id: '3',
            customerName: 'Mike Johnson',
            workDescription: 'Repair broken cabinet door',
            profession: 'Carpentry',
            bookingDate: '2024-01-13',
            bookingTime: '2024-01-13T09:00:00',
            status: 'PENDING',
        },
        {
            id: '4',
            customerName: 'Sarah Williams',
            workDescription: 'Paint living room walls',
            profession: 'Painting',
            bookingDate: '2024-01-12',
            bookingTime: '2024-01-12T11:00:00',
            status: 'COMPLETED',
        },
        {
            id: '5',
            customerName: 'David Brown',
            workDescription: 'Deep clean entire apartment',
            profession: 'Cleaning',
            bookingDate: '2024-01-11',
            bookingTime: '2024-01-11T08:00:00',
            status: 'CANCELLED',
        },
    ];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            PENDING: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-300', icon: Clock3 },
            CONFIRMED: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300', icon: CheckCircle2 },
            COMPLETED: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', icon: CheckCircle2 },
            CANCELLED: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300', icon: XCircle },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                <Icon className="size-3" />
                {status}
            </span>
        );
    };

    const handleAvailabilityToggle = async () => {
        const newStatus = !isActive;
        setIsActive(newStatus);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    console.log("newStatus", newStatus);
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                    const response = await updateWorkerStatus(newStatus, position.coords.latitude, position.coords.longitude)

                    if (response && response.success) {
                        if (newStatus) {
                            toast.success("You're now available for bookings", { position: 'top-right' })
                        } else {
                            toast.success("You're now unavailable for bookings", { position: 'top-right' })
                        }
                    } else {
                        setIsActive(!newStatus);
                        toast.error(response?.message || "Something went wrong")
                    }
                } catch (error) {
                    console.log("Error updating worker status:", error);
                    setIsActive(!newStatus);
                    toast.error("Something went wrong");
                }
            }, (error) => {
                console.log("Geolocation error:", error);
                setIsActive(!newStatus);
                toast.error("Unable to get your location. Please enable location access.");
            })
        } else {
            setIsActive(!newStatus);
            toast.error("Geolocation is not available in your browser");
        }
    }

    return (
        <div className="mainContainer min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Welcome {session?.user?.name}</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your availability and view your bookings
                        </p>
                    </div>
                </div>

                {/* Profile Completion Alert */}
                {
                    !isProfileCompleted ? (
                        <Alert className="max-w-5xl ml-[10%]" variant={"destructive"}>
                    <AlertTriangleIcon />
                    <AlertTitle>Your profile isn&apos;t completed</AlertTitle>
                    <AlertDescription>
                        Please complete your profile to start your journey and earn money.
                    </AlertDescription>
                    <AlertAction>
                        <Button variant="outline">
                            <Link href={"/w/profile/edit"}>
                                Complete Profile
                            </Link>
                        </Button>
                    </AlertAction>
                </Alert>
                    ): ("")
                }

                {/* Availability Toggle Card */}
                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-xl font-semibold text-foreground">Availability Status</h2>
                            <p className="text-sm text-muted-foreground">
                                Toggle your availability to receive booking requests
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`text-sm font-medium ${isActive ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                                {isActive ? 'Active' : 'Inactive'}
                            </span>
                            <Switch
                                checked={isActive}
                                onCheckedChange={handleAvailabilityToggle}
                                disabled={!isProfileCompleted}
                            />
                        </div>
                    </div>
                </div>

                <div className={`map ${isBookingAccepted ? 'block' : 'hidden'}`}>
                    <Map lat={latitude} lng={longitude} />
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Total Earnings Card */}
                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                                <p className="text-3xl font-bold text-foreground mt-2">
                                    ₹{totalEarnings.toLocaleString('en-IN')}
                                </p>
                            </div>
                            <div className="bg-primary/10 p-3 rounded-full">
                                <DollarSign className="size-6 text-primary" />
                            </div>
                        </div>
                    </div>

                    {/* Total Bookings Card */}
                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                                <p className="text-3xl font-bold text-foreground mt-2">
                                    {totalBookings}
                                </p>
                            </div>
                            <div className="bg-blue-500/10 p-3 rounded-full">
                                <Briefcase className="size-6 text-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-foreground">Recent Bookings</h2>
                    </div>

                    {recentBookings.length === 0 ? (
                        <div className="text-center py-12">
                            <Briefcase className="size-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <p className="text-muted-foreground">No bookings yet</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                When you receive bookings, they will appear here
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <User className="size-4 text-muted-foreground" />
                                                        <span className="font-medium text-foreground">
                                                            {booking.customerName}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        {booking.workDescription}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1.5">
                                                            <Briefcase className="size-4" />
                                                            {booking.profession}
                                                        </span>
                                                        <span className="flex items-center gap-1.5">
                                                            <Calendar className="size-4" />
                                                            {formatDate(booking.bookingDate)}
                                                        </span>
                                                        <span className="flex items-center gap-1.5">
                                                            <Clock className="size-4" />
                                                            {formatTime(booking.bookingTime)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="shrink-0">
                                                    {getStatusBadge(booking.status)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}