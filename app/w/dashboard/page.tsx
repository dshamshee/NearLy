'use client';

import { updateWorkerStatus } from "@/actions/updateWorkerStatus";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, DollarSign, Briefcase, User, CheckCircle2, XCircle, Clock3 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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
import { Bookings } from "@/types/booking";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSocket } from "@/utils/socketContext";
import { Spinner } from "@/components/ui/spinner";
import { zodIncomingBookingType } from "@/zod/incommingBooking";
import { IncomingMessage } from "http";




export default function WorkerDashboard() {
    const { data: session } = useSession();
    const {socket, isConnected} = useSocket();

    const [isActive, setIsActive] = useState<boolean>(false);
    const [incomingBooking, setIncomingBooking] = useState<zodIncomingBookingType | null>(null)
    const [trackingInterval, setTrackingInterval] = useState<NodeJS.Timeout | null>(null)
    const [isBookingAccepted, setIsBookingAccepted] = useState<boolean>(false);
    const [outForService, setOutForService] = useState<boolean>(false);
    const [arrivedAtDestination, setArrivedAtDestination] = useState<boolean>(false);
    const [arrivedNearby, setArrivedNearby] = useState<boolean>(false);
    const [latitude, setLatitude] = useState<number>(25.5941);
    const [longitude, setLongitude] = useState<number>(85.1376);
    const [isProfileCompleted, setIsProfileCompleted] = useState<boolean>(false);

    const [locationLoading, setLocationLoading] = useState<boolean>(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [currentAddress, setCurrentAddress] = useState<string | null>(null);
    const [addressLoading, setAddressLoading] = useState<boolean>(false);

    // Get worker profile status to check if their profile is completed or not
    useEffect(() => {
        const getWorkerDetails = async () => {
            const response = await getWorkerProfileStatus();
            setIsProfileCompleted(response.data!)
        }
        getWorkerDetails();
        
    }, [session])

    // Unregister from tracking server when component unmounts (only for workers)
    useEffect(() => {
        // Only unregister on actual component unmount, not on socket reconnects
        return () => {
            if(socket && socket.connected && session?.user?._id && session?.user?.role === 'WORKER' && isActive){
                socket.emit('unregister-active-worker', session?.user?._id);
            }
        };
    }, [socket, session, isActive]) // Removed isConnected to prevent re-running on reconnect

    // Re-register worker when socket reconnects if they were active
    useEffect(() => {
        if(!socket || !isConnected || !session?.user?._id || session?.user?.role !== 'WORKER' || !isActive) {
            return;
        }
        
        // Small delay to ensure socket is fully connected
        const timeoutId = setTimeout(() => {
            if(socket.connected) {
                socket.emit("register-active-worker", session.user._id);
            }
        }, 500);
        
        return () => clearTimeout(timeoutId);
    }, [socket, isConnected, session, isActive])


    // Handle incoming booking requests
    useEffect(() => {
        if (!socket) return;

        const handleIncomingRequest = async (data: zodIncomingBookingType) => {
            setIncomingBooking(data);
            toast.info("New booking request received!", {
                position: 'top-right',
                description: `You have a new booking request. Check details below.`
            });
        };

        socket.on("incoming-request", handleIncomingRequest);

        // Cleanup listener on unmount or socket change
        return () => {
            socket.off("incoming-request", handleIncomingRequest);
        };
    }, [socket])

    // Function to accept the booking
    const handleAcceptBooking = (bookingId: string)=>{
       try {
         if(!socket || !isConnected) return;
         socket.emit("accept-booking", {bookingId});
         toast.success("Booking accepted successfully", {
             position: 'top-right',
         });
         setIsBookingAccepted(true);
         // Keep incomingBooking so the card remains visible after acceptance
       } catch (error: unknown) {
        console.log(error instanceof Error ? error.message : "Internal Server Error on accept-booking");
        toast.error("Something went wrong", {
            position: 'top-right',
        });
        setIsBookingAccepted(false);
       }
    }


    const handleStartNavigation = ()=>{
        try {
            if(!socket || !isConnected) return;
            
            const interval = setInterval(() => {
                if(navigator.geolocation){
                    navigator.geolocation.getCurrentPosition((position)=>{
                        const location = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        }
                        socket.emit('update-location', {workerId: session?.user?._id, location});
                        console.log('updated location: ', location);

                        // Check if the worker has arrived nearby the destination
                        if(getDistanceInMeters(location.latitude, location.longitude, incomingBooking?.jobDetails.custLocation.latitude ?? 0, incomingBooking?.jobDetails.custLocation.longitude ?? 0) < 50){
                            setArrivedNearby(true);
                        }
                    })
                }

                // If the worker has arrived at the destination and click the "Arrived" button, then stop the interval
                if(arrivedAtDestination){
                    clearInterval(interval);
                }
            }, 5000);

            
        } catch (error: unknown) {
            console.log(error instanceof Error ? error.message : "Internal Server Error on start-navigation");
            toast.error("Something went wrong", {
                position: 'top-right',
            });
        }
    }



    const handleOutForService = (bookingId: string)=>{
        try {
            if(!socket || !isConnected) return;
            socket.emit("start-navigation", {bookingId});
            toast.success("You are now out for service", {
                position: 'top-right',
            });
            setOutForService(true);
            handleStartNavigation();
            
        } catch (error: unknown) {
            console.log(error instanceof Error ? error.message : "Internal Server Error on out-for-service");
            toast.error("Something went wrong", {
                position: 'top-right',
            });
            setOutForService(false);
            
        }
    }



    
  // Function to reverse geocode coordinates to address and set to the current address state
  const reverseGeocode = useCallback(async (latitude: number, longitude: number) => {
    try {
      setAddressLoading(true);
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.warn("Google Maps API key not found");
        return;
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        // Get the formatted address (first result is usually the most specific)
        const address = data.results[0].formatted_address;
        setCurrentAddress(address);
      } else {
        console.warn("Geocoding failed:", data.status);
        setCurrentAddress(null);
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      setCurrentAddress(null);
    } finally {
      setAddressLoading(false);
    }
  }, []);

  // Reverse geocode the incoming booking request's customer location and set to the current address state
  useEffect(()=>{
    if(incomingBooking){
        reverseGeocode(incomingBooking.jobDetails.custLocation.latitude, incomingBooking.jobDetails.custLocation.longitude);
    }
  },[incomingBooking])


  // Function to calculate the distance between two coordinates in meters
  const getDistanceInMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth radius in meters
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }



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

    // Function to toggle the availability status of the worker
    const handleAvailabilityToggle = async () => {
        const newStatus = !isActive;
        setIsActive(newStatus);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                    const response = await updateWorkerStatus(newStatus, position.coords.latitude, position.coords.longitude)

                    if (response && response.success) {
                        if (newStatus) {
                            toast.success("You're now available for bookings", { position: 'top-right' })
                            // Register with tracking server after successful status update
                            if (socket && socket.connected) {
                                socket.emit("register-active-worker", session?.user?._id);
                            } else if (socket && !socket.connected) {
                                // Wait for socket to connect before emitting
                                socket.once('connect', () => {
                                    socket.emit("register-active-worker", session?.user?._id);
                                });
                            }
                        } else {
                            toast.success("You're now unavailable for bookings", { position: 'top-right' })
                            // Unregister from tracking server when becoming inactive
                            if (socket && socket.connected && session?.user?._id) {
                                socket.emit("unregister-active-worker", session?.user?._id);
                            }
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
                    !isProfileCompleted && (
                        <Alert className="max-w-5xl md:ml-[10%]" variant={"destructive"}>
                            <AlertTriangleIcon />
                            <AlertTitle>Your profile isn&apos;t completed</AlertTitle>
                            <AlertDescription className="hidden md:block">
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
                    )
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

                {
                     !arrivedAtDestination && incomingBooking && (
                        <Card className=" mx-auto">
                            {/* <CardHeader> */}
                            {/* </CardHeader> */}
                            <CardContent className="flex md:flex-row flex-col items-center justify-between gap-2">
                                <div>
                                <CardTitle>
                                <p className="text-lg font-semibold">BOOKING FOR {incomingBooking.jobDetails.workNeededProfession.toUpperCase()}</p>
                                </CardTitle>
                                <CardDescription>
                                    <p className="text-sm text-muted-foreground">Details: {incomingBooking.jobDetails.workNeededDescription}</p>
                                {
                                    addressLoading ? (
                                        <p className="text-sm text-muted-foreground animate-pulse">Loading address... <Spinner className="size-4 inline-block" /></p>
                                    )
                                    : (
                                        <p className="text-sm text-muted-foreground">Cutomer Location: {currentAddress ?? "No address found"}</p>
                                    )
                                }
                                <p className="text-sm text-muted-foreground">Distance from you: {getDistanceInMeters(incomingBooking.jobDetails.custLocation.latitude, incomingBooking.jobDetails.custLocation.longitude, latitude, longitude)} Km</p>
                                </CardDescription>
                                </div>
                                <div className="flex flex-row items-center justify-between gap-2">
                                <Button disabled={isBookingAccepted} className="cursor-pointer text-red-500" variant="outline">Reject</Button>
                                <Button disabled={isBookingAccepted} className="cursor-pointer text-green-500" variant="outline" onClick={()=>handleAcceptBooking(incomingBooking.bookingId)}>Accept</Button>
                                <Button disabled={!isBookingAccepted} className="cursor-pointer text-blue-500" variant="outline" onClick={()=> handleOutForService(incomingBooking.bookingId)}>Out for Service</Button>
                                <Button disabled={!arrivedNearby} className="cursor-pointer text-green-500" variant="outline" onClick={()=> setArrivedAtDestination(true)}>Arrived</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                }

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