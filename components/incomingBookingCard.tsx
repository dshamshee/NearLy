'use client';
import { useWorkerStore } from "@/store/useWorkerStore";
import { Button } from "./ui/button";
import { isWorkerArrived, isWorkerOutForService, updateBookingStatus } from "@/actions/updateBooking";
import { toast } from "sonner";
import { useCallback, useEffect, useRef, useState } from "react";
import { Spinner } from "./ui/spinner";
import { useSocket } from "@/utils/socketContext";
import { useSession } from "next-auth/react";

import { convertToMeters, formatDistance, reverseGeocode, calculateDistance } from "@/helpers/calculateDistance";
import { getPreciseLocation, getCurrentCoordinates, type LocationCoords } from "@/helpers/getCurrentLocation";


export const IncomingBookingCard = ({ type }: { type: "worker" | "customer" }) => {

    const { socket, isConnected } = useSocket();

    const { data: session } = useSession();

    const [currentAddress, setCurrentAddress] = useState<string | null>(null);
    const [addressLoading, setAddressLoading] = useState<boolean>(false);
    const [distance, setDistance] = useState<string>("");

    // Zustand store state and actions
    const {
        incomingBooking,
        isBookingAccepted,
        outForService,
        arrivedAtDestination,
        arrivedNearby,
        location,
        isWorkDoneClicked,
        workDoneInterval,
        updateLocation,
        setIncomingBooking,
        setBookingAccepted,
        setOutForService,
        setArrivedAtDestination,
        setArrivedNearby,
        setMakePayment,
        setYourOTP,
        setIsMapLoaded,
        setIsWorkDoneClicked,
        setWorkDoneInterval,
        resetBookingFlow,
    } = useWorkerStore();

    const latitude = location.latitude;
    const longitude = location.longitude;

    // Ref to store the location sharing interval ID
    const locationIntervalRef = useRef<NodeJS.Timeout | null>(null);
    // Ref to store the work done interval ID
    const workDoneIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Stop location sharing when worker arrives at destination
    // useEffect(() => {
    //     if (arrivedAtDestination && locationIntervalRef.current) {
    //         clearInterval(locationIntervalRef.current);
    //         locationIntervalRef.current = null;
    //     }
    // }, [arrivedAtDestination])

    // Stop location sharing when worker arrives at destination
    useEffect(() => {
        if (arrivedAtDestination && locationIntervalRef.current) {
            clearInterval(locationIntervalRef.current);
            locationIntervalRef.current = null;
        }
    }, [arrivedAtDestination])

    // Cleanup intervals on component unmount
    useEffect(() => {
        return () => {
            if (locationIntervalRef.current) {
                clearInterval(locationIntervalRef.current);
                locationIntervalRef.current = null;
            }
            if (workDoneIntervalRef.current) {
                clearInterval(workDoneIntervalRef.current);
                workDoneIntervalRef.current = null;
            }
        };
    }, [])


    // Listen for payment received from the server 
    useEffect(() => {
        if (!socket || !isConnected) return;
        const handlePaymentReceived = () => {
            console.log("Payment received from the server")
            toast.success("Payment received from the server", {
                position: 'top-right',
            });
            setMakePayment(true);
        }
        socket.on("payment-received", handlePaymentReceived);
        return () => {
            socket.off("payment-received", handlePaymentReceived);
        }
    }, [socket, isConnected])


    // Function to reverse geocode coordinates to address and set to the current address state
    const getFullAddress = useCallback(async () => {
        try {
           const address = await reverseGeocode(Number(incomingBooking?.jobDetails?.custLocation?.latitude), Number(incomingBooking?.jobDetails?.custLocation?.longitude))
           setCurrentAddress(address)
        } catch (error: unknown) {
            console.log(error instanceof Error ? error.message : "Internal Server Error on getFullAddress");
            toast.error("Something went wrong", {
                position: 'top-right',
            });
            setCurrentAddress("Address not found. Please try again later.");
        } finally {
            setAddressLoading(false);
        }
    }, [incomingBooking]);

    // Reverse geocode the incoming booking request's customer location and set to the current address state
    useEffect(() => {
        if (incomingBooking) {
            const dist = calculateDistance(latitude, longitude, incomingBooking?.jobDetails?.custLocation?.latitude, incomingBooking?.jobDetails?.custLocation?.longitude)
            setDistance(formatDistance(dist))
            getFullAddress();

        }
    }, [incomingBooking])


    // Function to accept the booking
    const handleAcceptBooking = async (bookingId: string) => {
        try {
            if (!socket || !isConnected) return;
            socket.emit("accept-booking", { bookingId });
            toast.success("Booking accepted successfully", {
                position: 'top-right',
            });
            resetBookingFlow();
            setBookingAccepted(true);
            setIsMapLoaded(true);
            await updateBookingStatus(bookingId, "ACCEPTED");
            if (workDoneIntervalRef.current) {
                clearInterval(workDoneIntervalRef.current);
                workDoneIntervalRef.current = null;
            }
            setWorkDoneInterval(0);
        } catch (error: unknown) {
            console.log(error instanceof Error ? error.message : "Internal Server Error on accept-booking");
            toast.error("Something went wrong", {
                position: 'top-right',
            });
            setBookingAccepted(false);
            setIsMapLoaded(false);
        }
    }

    // Function to reject the booking
    const handleRejectBooking = async (bookingId: string) => {
        try {
            if (!socket || !isConnected) return;
            socket.emit("reject-booking", { bookingId });
            toast.success("Booking rejected successfully", {
                position: 'top-right',
            });
            setBookingAccepted(false);
            setIsMapLoaded(false);
            setIncomingBooking(null);
            await updateBookingStatus(bookingId, "REJECTED");
        } catch (error: unknown) {
            console.log(error instanceof Error ? error.message : "Internal Server Error on reject-booking");
            toast.error("Something went wrong", {
                position: 'top-right',
            });
            setBookingAccepted(false);
            setIsMapLoaded(false);
        }
    }

    // Helper function to check location and update state
    const checkLocationAndUpdate = (coords: LocationCoords) => {
        const loc = { latitude: coords.latitude, longitude: coords.longitude };

        updateLocation(loc.latitude, loc.longitude);

        // Emit location update to server
        if (socket && session?.user?._id) {
            socket.emit('update-location', { workerId: session.user._id, location: loc });
            console.log('updated location: ', loc);
        }

        // Check if the worker has arrived nearby the destination
        const booking = useWorkerStore.getState().incomingBooking;
        if (booking?.jobDetails?.custLocation?.latitude && booking?.jobDetails?.custLocation?.longitude) {
            // Calculate the distance between worker and customer
            const dist = calculateDistance(loc.latitude, loc.longitude, Number(booking?.jobDetails?.custLocation?.latitude), Number(booking?.jobDetails?.custLocation?.longitude))
            const distInMeters = convertToMeters(dist);
            if (distInMeters < 700) {
                setArrivedNearby(true);
            }
        }
    };

    // Function to send the worker's location update to the customer
    const handleStartNavigation = () => {
        try {
            if (!socket || !isConnected) return;

            // Clear any existing interval before starting a new one
            if (locationIntervalRef.current) {
                clearInterval(locationIntervalRef.current);
                locationIntervalRef.current = null;
            }

            // Reset arrivedNearby state when starting navigation
            setArrivedNearby(false);

            // Check location immediately when starting navigation (high accuracy for live tracking)
            getPreciseLocation()
                .then(checkLocationAndUpdate)
                .catch((error: GeolocationPositionError) => {
                    const msg = `Geolocation error (code ${error.code}): ${error.message}`;
                    console.error(msg);
                    const userMsg = error.code === 1
                        ? "Location access denied. Please enable location permissions."
                        : error.code === 3
                            ? "Location request timed out. Please try again."
                            : "Unable to get your location. Please enable location access.";
                    toast.error(userMsg, { position: 'top-right' });
                });

            // Set up interval to check location every 5 seconds (allow cached position for reliability)
            const interval = setInterval(() => {
                getCurrentCoordinates({ enableHighAccuracy: false, timeout: 15000, maximumAge: 5000 })
                    .then(checkLocationAndUpdate)
                    .catch((error: GeolocationPositionError) => {
                        console.warn(`Geolocation in interval (code ${error.code}): ${error.message}`);
                    });
            }, 5000);

            // Store the interval ID in the ref
            locationIntervalRef.current = interval;

        } catch (error: unknown) {
            console.log(error instanceof Error ? error.message : "Internal Server Error on start-navigation");
            toast.error("Something went wrong", {
                position: 'top-right',
            });
        }
    }

    // Function to notify the customer that the worker is on the way and start navigation
    const handleOutForService = async (bookingId: string) => {
        try {
            if (!socket || !isConnected) return;
            socket.emit("start-navigation", { bookingId });
            toast.success("You are now out for service", {
                position: 'top-right',
            });
            setOutForService(true);
            handleStartNavigation();
            await isWorkerOutForService(bookingId, true);
        } catch (error: unknown) {
            console.log(error instanceof Error ? error.message : "Internal Server Error on out-for-service");
            toast.error("Something went wrong", {
                position: 'top-right',
            });
            setOutForService(false);
        }
    }

    // Function to notify the customer that the worker has arrived at the location and the service is started
    const handleStartWorking = async () => {
        // Stop location sharing when worker arrives
        if (locationIntervalRef.current) {
            clearInterval(locationIntervalRef.current);
            locationIntervalRef.current = null;
        }

        // Clear any existing work interval before starting a new one
        if (workDoneIntervalRef.current) {
            clearInterval(workDoneIntervalRef.current);
            workDoneIntervalRef.current = null;
        }

        setArrivedAtDestination(true);
        await isWorkerArrived(incomingBooking?.bookingId as string, true);

        // Set initial countdown value (5 seconds)
        setWorkDoneInterval(5);

        // Start countdown interval
        const interval = setInterval(() => {
            setWorkDoneInterval((prev) => {
                const newValue = prev - 1;

                // Clear interval when countdown reaches 0 or below
                if (newValue <= 0) {
                    if (workDoneIntervalRef.current) {
                        clearInterval(workDoneIntervalRef.current);
                        workDoneIntervalRef.current = null;
                        setArrivedNearby(false);
                    }
                    return 0;
                }

                return newValue;
            });
        }, 1000);

        // Store the interval ID in the ref
        workDoneIntervalRef.current = interval;


        // Notify the customer 
        try {
            if (!socket || !isConnected) return;

            socket?.emit("confirm-reached", { bookingId: incomingBooking?.bookingId });
            toast.success("You have arrived at the location", {
                position: 'top-right',
            });
            setIsMapLoaded(false);
        } catch (error: unknown) {
            console.log(error instanceof Error ? error.message : "Internal Server Error on handleStartWorking");
            toast.error("Something went wrong", {
                position: 'top-right',
            });

            setIsMapLoaded(true);
            setWorkDoneInterval(0);
        }
    }

    // Function to handle the work done and display the payment card
    const handleWorkDone = () => {
        setIsWorkDoneClicked(true);
        setMakePayment(true);
    }





    return (
        <>
            {incomingBooking && (
                <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="bg-orange-500/5 border-b border-orange-500/10 px-5 py-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <span className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                                    New request
                                </span>
                                <h3 className="text-lg font-semibold text-foreground mt-0.5">
                                    {incomingBooking.jobDetails.workNeededProfession}
                                </h3>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                                    ₹{incomingBooking.jobDetails.priceRange}
                                </p>
                                <p className="text-xs text-muted-foreground">{distance} away</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 space-y-4">
                        <p className="text-sm text-foreground">
                            {incomingBooking.jobDetails.workNeededDescription}
                        </p>
                        {addressLoading ? (
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <Spinner className="size-4 animate-spin" /> Loading address...
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="shrink-0">📍</span>
                                {currentAddress ?? "Address unavailable"}
                            </p>
                        )}
                        <div className="flex flex-wrap gap-2 pt-2">
                            {type === "worker" ? (
                                <>
                                    <Button
                                        disabled={isBookingAccepted}
                                        variant="outline"
                                        size="sm"
                                        className="cursor-pointer border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:hover:bg-red-950/30"
                                        onClick={() => handleRejectBooking(incomingBooking.bookingId)}
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        disabled={isBookingAccepted}
                                        size="sm"
                                        className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white"
                                        onClick={() => handleAcceptBooking(incomingBooking.bookingId)}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        disabled={!isBookingAccepted || outForService}
                                        variant="outline"
                                        size="sm"
                                        className="cursor-pointer border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 dark:border-orange-900/50 dark:hover:bg-orange-950/30"
                                        onClick={() => handleOutForService(incomingBooking.bookingId)}
                                    >
                                        Out for Service
                                    </Button>
                                    <Button
                                        disabled={!outForService || !arrivedNearby || arrivedAtDestination}
                                        variant="outline"
                                        size="sm"
                                        className="cursor-pointer"
                                        onClick={handleStartWorking}
                                    >
                                        Arrived
                                    </Button>
                                    <Button
                                        disabled={workDoneInterval !== 0 || !arrivedAtDestination || isWorkDoneClicked}
                                        variant="outline"
                                        size="sm"
                                        className="cursor-pointer border-green-200 text-green-600 hover:bg-green-50 dark:border-green-900/50 dark:hover:bg-green-950/30"
                                        onClick={handleWorkDone}
                                    >
                                        {workDoneInterval !== 0 ? `${workDoneInterval}s` : "Done"}
                                    </Button>
                                </>
                            ) : (
                                <Button size="sm">Customer Buttons</Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}