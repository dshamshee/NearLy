'use client';
import { updateWorkerStatus } from "@/actions/updateWorkerStatus";
import { useWorkerStore } from "@/store/useWorkerStore";
import { useSession } from "next-auth/react";
import { useSocket } from "@/utils/socketContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { Switch } from "@/components/ui/switch";
import { getWorkerProfileStatus } from "@/actions/workerProfileStatus";
import {
    Alert,
    AlertAction,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { AlertTriangleIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useSearchParams } from "next/navigation";

export const WorkerAvailability = () => {
    const { data: session } = useSession();
    const { socket, isConnected } = useSocket();
    const searchParams = useSearchParams();

    // Zustand store state and actions
    const { isActive, setAvailability, location } = useWorkerStore();
    
    // Get the worker's latitude and longitude
    const latitude = location.latitude;
    const longitude = location.longitude;

    const [isActiveLoading, setIsActiveLoading] = useState<boolean>(false);
    const [isProfileCompleted, setIsProfileCompleted] = useState<boolean>(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [checkingProfileStatus, setCheckingProfileStatus] = useState<boolean>(true);


    // Check if the worker's profile is completed or not 
    useEffect(() => {
        const checkProfileStatus = async () => {
            // setCheckingProfileStatus(true);
            const response = await getWorkerProfileStatus();
            setIsProfileCompleted(response.data!);
            setCheckingProfileStatus(false);
        }
        checkProfileStatus();

        if (session?.user?._id) {
            // Check if the worker's location is available or not
            if (navigator.geolocation) {
                const tryGetPosition = (options: PositionOptions, isRetry = false) => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            useWorkerStore.getState().updateLocation(position.coords.latitude, position.coords.longitude);
                            setLocationError(null);
                        },
                        (error: GeolocationPositionError) => {
                            if (error.code === 3 && !isRetry) {
                                // Timeout: retry with relaxed options (network/cached location is faster)
                                tryGetPosition({
                                    enableHighAccuracy: false,
                                    timeout: 15000,
                                    maximumAge: 60000
                                }, true);
                                return;
                            }
                            const msg = `Geolocation error (code ${error.code}): ${error.message}`;
                            console.error(msg);
                            setLocationError(msg);
                            const userMsg = error.code === 1
                                ? "Location access denied. Please enable location permissions."
                                : error.code === 3
                                    ? "Location request timed out. Please try again."
                                    : "Unable to get your location. Please enable location access.";
                            toast.error(userMsg, {
                                position: 'top-right',
                            });
                        },
                        options
                    );
                };
                tryGetPosition({
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 0
                });
            }
        }
    }, [session?.user?._id]);

    
    // Unregister from tracking server when component unmounts (only for workers)
    useEffect(() => {
        // Only unregister on actual component unmount, not on socket reconnects
        return () => {
            if (socket && socket.connected && session?.user?._id && session?.user?.role === 'WORKER' && isActive) {
                socket.emit('unregister-active-worker', session?.user?._id);
            }
        };
    }, [socket, session?.user?._id, session?.user?.role, isActive]) // Use stable primitives instead of session object to avoid re-runs on tab switch

    // Re-register worker when socket reconnects if they were active
    useEffect(() => {
        if (!socket || !isConnected || !session?.user?._id || session?.user?.role !== 'WORKER' || !isActive) {
            return;
        }

        // Small delay to ensure socket is fully connected
        const timeoutId = setTimeout(() => {
            if (socket.connected) {
                socket.emit("register-active-worker", session.user._id);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [socket, isConnected, session?.user?._id, session?.user?.role, isActive]) // Use stable primitives instead of session object to avoid re-runs on tab switch


        // Show login success toast when redirected from login
        useEffect(() => {
            if (searchParams.get("login") === "success" && typeof window !== "undefined") {
                toast.success("Login Successful");
                const url = new URL(window.location.href);
                url.searchParams.delete("login");
                window.history.replaceState({}, "", url.pathname + (url.search || ""));
            }
    
        }, [searchParams]);

    // Function to toggle the availability status of the worker
    const handleAvailabilityToggle = async () => {

        if (!socket || !isConnected || !session?.user?._id || session?.user?.role !== 'WORKER') {
            return;
        }
        if (!latitude || !longitude) {
            toast.error("Location is not available", { position: 'top-right' });
            return;
        }

        setIsActiveLoading(true);
        const newStatus = !isActive;
        try {
            if (latitude && longitude) {
                const response = await updateWorkerStatus(newStatus, latitude, longitude);

                if (response.success) {
                    setAvailability(newStatus);
                    if (newStatus) {
                        if (socket && socket.connected) {
                            socket.emit("register-active-worker", session?.user?._id);
                            toast.success("You are now available for bookings", { position: 'top-right' });
                        } else if (socket && !socket.connected) {
                            socket.once('connect', () => {
                                socket.emit("register-active-worker", session?.user?._id);
                                toast.success("You are now available for bookings", { position: 'top-right' });
                            });
                        }
                    } else {
                        if (socket && socket.connected && session?.user?._id) {
                            socket.emit("unregister-active-worker", session?.user?._id);
                            toast.success("You are now unavailable for bookings", { position: 'top-right' });
                        }
                    }
                } else {
                    setAvailability(!newStatus);
                    toast.error(response?.message || "Something went wrong");
                }
            }
        } catch (error: unknown) {
            setAvailability(!newStatus);
            console.log(error instanceof Error ? error.message : "Internal Server Error on handleAvailabilityToggle");
            toast.error("Something went wrong", {
                position: 'top-right',
            });
        } finally {
            setIsActiveLoading(false);
        }
    }

    return (

        <>

            {
                checkingProfileStatus ? (
                    <div className="flex items-center justify-center">
                        <Spinner className="size-4 inline-block animate-spin" />
                        <p className="text-sm text-muted-foreground">Checking your profile status...</p>
                    </div>
                ) : (
                    !isProfileCompleted && (
                        <Alert className="max-w-5xl md:ml-[10%]" variant={"destructive"}>
                            <AlertTriangleIcon />
                            <AlertTitle>Your profile isn&apos;t completed</AlertTitle>
                            <AlertDescription className="hidden md:block">
                                Please complete your profile to start your journey and earn money.
                            </AlertDescription>
                            <AlertAction >
                                <Link href={`/w/profile/edit`}>
                                    <Button variant="outline" className="cursor-pointer">
                                        Edit Profile
                                    </Button>
                                </Link>
                            </AlertAction>
                        </Alert>
                    )
                )
            }
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
                        {
                            isActiveLoading ? (
                                <Spinner className="size-4 inline-block animate-spin" />
                            ) : (
                                <Switch
                                    checked={isActive}
                                    onCheckedChange={handleAvailabilityToggle}
                                    disabled={!isProfileCompleted}
                                />
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}