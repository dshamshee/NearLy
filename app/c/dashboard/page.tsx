'use client';
import { findNearbyWorkers } from "@/actions/findNearbyWorkers";
import { Map } from "@/components/map";
import { NearbyWorkers } from "@/components/nearbyWorkers";
import { RecentProfessionals } from "@/components/recentProfessionals";
import { Searching } from "@/components/searching";
import { Worker } from "@/types/worker";
import { zodSearchingType } from "@/zod/searching";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner"
import { useSocket } from "@/utils/socketContext";


export interface NearbyWorkerType extends Omit<Worker, 'userId'> {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        avatar: string;
    }
}


export default function CustomerDashboard() {
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);
    const [bookingDetails, setBookingDetails] = useState<zodSearchingType | null>(null);
    const [nearbyWorkers, setNearbyWorkers] = useState<NearbyWorkerType[] | null>(null);
    const [trackingBookingId, setTrackingBookingId] = useState<string | null>(null);
    const [isBookingsent, setIsBookingsent] = useState<boolean>(false);


    const [isBookingAccepted, setIsBookingAccepted] = useState<boolean>(false);
    const [isWorkerArrived, setIsWorkerArrived] = useState<boolean>(false);
    const [isWorkerOnTheWay, setIsWorkerOnTheWay] = useState<boolean>(false);
    const [isServiceStarted, setIsServiceStarted] = useState<boolean>(false);
    const [workerCurrentLocation, setWorkerCurrentLocation] = useState<{latitude: number, longitude: number} | null>(null);

    const { data: session } = useSession();
    console.log(nearbyWorkers);
    const { socket, isConnected } = useSocket();

    // Listen for booking confirmation from worker
    useEffect(() => {
        if (!socket) return;

        const handleBookingConfirmed = (data: { msg: string }) => {
            console.log("Booking confirmed:", data);
            setIsBookingAccepted(true);
            toast.success("Worker accepted your booking!", {
                position: 'top-right',
            });
        };

        const handleBookingError = (error: { message: string }) => {
            console.error("Booking error:", error);
            toast.error(error.message || "Booking request failed", {
                position: 'top-right',
            });
            setIsBookingsent(false);
        };

        const handleWorkerStartedNavigation = ()=>{
            setIsWorkerOnTheWay(true);
            toast.success("Worker is on the way", {
                position: 'top-right',
            });
        }

        const handleStartNavigationError = (error: { message: string })=>{
            toast.error(error.message || "Something went wrong", {
                position: 'top-right',
            });
            setIsWorkerOnTheWay(false);
        }

        const handleLocationBroadcast = (location: {latitude: number, longitude: number})=>{
            setWorkerCurrentLocation(location);
        }

        const handleUpdateLocationError = (error: { message: string })=>{
            toast.error(error.message || "Something went wrong", {
                position: 'top-right',
            });
            setWorkerCurrentLocation(null);
        }

        const handleWorkerArrived = ()=>{
            setIsWorkerArrived(true);
            setIsServiceStarted(true);
            toast.success("Service has started", {
                position: 'top-right',
            });
        }

        const handleConfirmReachedError = (error: { message: string })=>{
            toast.error(error.message || "Something went wrong", {
                position: 'top-right',
            });
            setIsWorkerArrived(false);
            setIsServiceStarted(false);
        }

        socket.on("booking-confirmed", handleBookingConfirmed);
        socket.on("booking-request-error", handleBookingError);
        socket.on("worker-started-navigation", handleWorkerStartedNavigation);
        socket.on('location-broadcast', handleLocationBroadcast);
        socket.on("worker-arrived", handleWorkerArrived);
        socket.on("start-navigation-error", handleStartNavigationError);
        socket.on("update-location-error", handleUpdateLocationError);
        socket.on("confirm-reached-error", handleConfirmReachedError);

        return () => {
            socket.off("booking-confirmed", handleBookingConfirmed);
            socket.off("booking-request-error", handleBookingError);
            socket.off("worker-started-navigation", handleWorkerStartedNavigation);
            socket.off('location-broadcast', handleLocationBroadcast);
            socket.off("worker-arrived", handleWorkerArrived);
        };
    }, [socket]);

    // Update customer socket ID when reconnecting with a pending booking
    useEffect(() => {
        if (!socket || !isConnected || !trackingBookingId || isBookingAccepted) return;

        // Small delay to ensure socket is fully connected
        const timeoutId = setTimeout(() => {
            if (socket.connected && trackingBookingId) {
                socket.emit("update-customer-socket", { bookingId: trackingBookingId });
                console.log("Updated customer socket for booking:", trackingBookingId);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [socket, isConnected, trackingBookingId, isBookingAccepted]);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371e3; // Earth radius in meters
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d;
    }

    // Helper function to convert Decimal128 or number to number
    const toNumber = (value: number | { toString(): string } | undefined): number => {
        if (value === undefined || value === null) return 0;
        if (typeof value === 'number') return value;
        // Handle Decimal128 type (has toString method)
        if (typeof value === 'object' && 'toString' in value) {
            return parseFloat(value.toString());
        }
        return 0;
    }



    // Fin
    useEffect(() => {
        const getNearbyWorkers = async () => {
            if (!bookingDetails || !mapLoaded) return;

            // Validate location before making API call
            if (!bookingDetails.custLocation.latitude || !bookingDetails.custLocation.longitude) {
                console.error("Invalid location data:", bookingDetails.custLocation);
                return;
            }

            try {
                const workers = await findNearbyWorkers(bookingDetails.custLocation.latitude, bookingDetails.custLocation.longitude, bookingDetails.workNeededProfession);
                console.log("workers", workers);
                if (workers && workers.length > 0) {
                    setNearbyWorkers(workers);
                    toast.success("Fetched nearby workers successfully", { duration: 3000, position: 'top-center', description: "We found some professionals near you. Please check the list below." })
                } else {
                    console.log("No nearby workers found");
                    setNearbyWorkers([]);
                    toast.error("No nearby workers available", { duration: 3000, position: 'top-center', description: "We couldn't find any professionals near you. Please try again with a different location or profession." })
                }
            } catch (error) {
                console.error("Error fetching nearby workers:", error);
                toast.error("Something went wrong", { duration: 3000, position: 'top-center' })
            }
        }

        getNearbyWorkers();
    }, [bookingDetails, mapLoaded]);


    // Function to send a booking request to a worker
    const sendBookingRequest = (workerId: string) => {
        if (!socket || !isConnected) {
            toast.error("Not connected to server. Please wait...");
            return;
        }

        if (!bookingDetails) {
            toast.error("Booking details are missing");
            return;
        }

        const bookingId = `${session?.user?._id}-${workerId}`;
        setTrackingBookingId(bookingId);

        socket.emit("send-booking-request", {
            bookingId: bookingId,
            selectedWorkerId: workerId,
            jobDetails: bookingDetails
        });

        console.log("Booking request sent:", { bookingId, selectedWorkerId: workerId });
        setIsBookingsent(true);
        toast.success("Booking request sent successfully");
    }


    return (
        <div className="mainContainer min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">

            <div className="hero w-full flex md:flex-row flex-col items-center justify-between gap-10 md:px-16 py-5">
                <div className={`text text-center ${mapLoaded ? 'hidden' : 'block'}`}>
                    <h1 className="text-4xl font-bold text-foreground">Don&apos;t wait, get help now!</h1>
                    <p className="text-lg text-gray-500">Get instant access to skilled professionals in your neighborhood.</p>

                    <div className="search mt-4 ">
                        <Searching
                            setBookingDetails={(data) => setBookingDetails(data)}
                            setMapLoaded={setMapLoaded}
                        />
                    </div>


                </div>
                <div className={`${mapLoaded ? 'hidden' : 'block'}`}>
                    <div className={`illustration relative md:flex items-center justify-center hidden`}>
                        <Image src={'/CustIllustration2.svg'} alt="Dashboard" width={600} height={600} className="relative z-0" />
                        <Image src={'/CustIllustration1.svg'} alt="Dashboard" width={150} height={150} className="absolute z-20 top-1/7 left-1/5 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                </div>
                <div className={`mapSection w-full h-full ${mapLoaded ? 'block' : 'hidden'}`}>
                    <Map lat={22.3033} lng={73.2002} custLat={bookingDetails?.custLocation.latitude ?? 0} custLng={bookingDetails?.custLocation.longitude ?? 0} />
                </div>

            </div>


            {nearbyWorkers && nearbyWorkers.length > 0 && !isBookingsent ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{
                    nearbyWorkers.map((worker) => {
                        const distance = calculateDistance(
                            bookingDetails?.custLocation.latitude ?? 0,
                            bookingDetails?.custLocation.longitude ?? 0,
                            toNumber(worker.latitude),
                            toNumber(worker.longitude)
                        );

                        return (
                            <NearbyWorkers
                                key={worker.userId._id.toString()}
                                avatar={worker.userId.avatar}
                                name={worker.userId.name}
                                experience={worker.workExperience ?? "0"}
                                distance={distance}
                                ratings={worker.averageRating ?? 0.0}
                                serviceCharge={worker.serviceCharge ?? 0}
                                sendBookingRequest={sendBookingRequest}
                                workerId={worker.userId._id}

                            />)
                    })}
                </div>
            ) : isBookingsent && !isBookingAccepted ? (
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <h1 className="text-xl font-semibold">Wait for the worker to accept the booking</h1>
                    <Spinner className="size-6" data-icon="inline-start" />
                </div>
            ) : isBookingAccepted ? (
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <h1 className="text-xl font-semibold text-green-600">Booking confirmed! Worker has accepted your request.</h1>
                </div>
            ) : null
            }

            {!nearbyWorkers && (
                <div className="recentProfessionals mt-10">
                    <h2 className="md:text-2xl text-xl font-bold text-foreground mb-2">Recent Professionals</h2>
                    <div className="recentProfessionalsList grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <RecentProfessionals name="Mehul Dalvadi" avatar="https://github.com/shadcn.png" experience={10} location={4} rating={4.5} />
                        <RecentProfessionals name="Sivaniba Bhadoriya" avatar="https://github.com/shadcn.png" experience={5} location={2} rating={4.0} />
                        <RecentProfessionals name="Vivek Dave" avatar="https://github.com/shadcn.png" experience={3} location={1} rating={3.5} />
                    </div>
                </div>
            )

            }





        </div>
    )
}

{/*  */ }