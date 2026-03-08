'use client';
import { useWorkerStore } from "@/store/useWorkerStore";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { isWorkerArrived, isWorkerOutForService, updateBookingStatus } from "@/actions/updateBooking";
import { toast } from "sonner";
import { useCallback, useEffect, useRef, useState } from "react";
import { Spinner } from "./ui/spinner";
import { useSocket } from "@/utils/socketContext";
import { useSession } from "next-auth/react";


export const IncomingBookingCard = ({ type }: { type: "worker" | "customer" }) => {

    const { socket, isConnected } = useSocket();

    const { data: session } = useSession();

    const [currentAddress, setCurrentAddress] = useState<string | null>(null);
    const [addressLoading, setAddressLoading] = useState<boolean>(false);

    // Zustand store state and actions
    const {
        isActive,
        incomingBooking,
        isBookingAccepted,
        outForService,
        arrivedAtDestination,
        arrivedNearby,
        location,
        amount,
        isPaymentReceived,
        verifyPayment,
        makePayment,
        yourOTP,
        isMapLoaded,
        isWorkDoneClicked,
        workDoneInterval,
        updateLocation,
        setIncomingBooking,
        setBookingAccepted,
        setOutForService,
        setArrivedAtDestination,
        setArrivedNearby,
        setAmount,
        setIsPaymentReceived,
        setVerifyPayment,
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
    useEffect(() => {
        if (arrivedAtDestination && locationIntervalRef.current) {
            clearInterval(locationIntervalRef.current);
            locationIntervalRef.current = null;
        }
    }, [arrivedAtDestination])

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

    // Stop location sharing when worker arrives at destination
    useEffect(() => {
        if (arrivedAtDestination && locationIntervalRef.current) {
            clearInterval(locationIntervalRef.current);
            locationIntervalRef.current = null;
        }
    }, [arrivedAtDestination])


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
    useEffect(() => {
        if (incomingBooking) {
            reverseGeocode(incomingBooking.jobDetails.custLocation.latitude, incomingBooking.jobDetails.custLocation.longitude);
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
    const checkLocationAndUpdate = (position: GeolocationPosition) => {
        const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        };

        updateLocation(loc.latitude, loc.longitude);

        // Emit location update to server
        if (socket && session?.user?._id) {
            socket.emit('update-location', { workerId: session.user._id, location: loc });
            console.log('updated location: ', loc);
        }

        // Check if the worker has arrived nearby the destination
        const booking = useWorkerStore.getState().incomingBooking;
        if (booking?.jobDetails?.custLocation?.latitude && booking?.jobDetails?.custLocation?.longitude) {
            const distance = getDistanceInMeters(
                loc.latitude,
                loc.longitude,
                booking.jobDetails.custLocation.latitude,
                booking.jobDetails.custLocation.longitude
            );

            console.log('Distance to destination:', distance, 'meters');

            if (distance < 20) {
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

            // Check location immediately when starting navigation
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        checkLocationAndUpdate(position);
                    },
                    (error: GeolocationPositionError) => {
                        const msg = `Geolocation error (code ${error.code}): ${error.message}`;
                        console.error(msg);
                        const userMsg = error.code === 1
                            ? "Location access denied. Please enable location permissions."
                            : error.code === 3
                                ? "Location request timed out. Please try again."
                                : "Unable to get your location. Please enable location access.";
                        toast.error(userMsg, {
                            position: 'top-right',
                        });
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 20000,
                        maximumAge: 0
                    }
                );
            }

            // Set up interval to check location every 5 seconds (allow cached position for reliability)
            const interval = setInterval(() => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            checkLocationAndUpdate(position);
                        },
                        (error: GeolocationPositionError) => {
                            console.warn(`Geolocation in interval (code ${error.code}): ${error.message}`);
                        },
                        {
                            enableHighAccuracy: false,
                            timeout: 15000,
                            maximumAge: 5000
                        }
                    );
                }
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
        setYourOTP(Math.floor(100000 + Math.random() * 900000).toString());
    }

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

    return (
        <>
            {
                incomingBooking && (
                    <Card className=" mx-auto">
                        <CardContent className="flex md:flex-row flex-col items-center justify-between gap-2">
                            <div>
                                <CardTitle>
                                    <p className="text-lg font-semibold">BOOKING FOR {incomingBooking.jobDetails.workNeededProfession.toUpperCase()}</p>
                                </CardTitle>
                                <CardDescription>
                                    <p className="text-sm text-muted-foreground">Details: {incomingBooking.jobDetails.workNeededDescription}</p>
                                    <p className="text-sm text-muted-foreground">Price Range: ₹{incomingBooking.jobDetails.priceRange}</p>
                                    {
                                        addressLoading ? (
                                            <p className="text-sm text-muted-foreground animate-pulse">Loading address... <Spinner className="size-4 inline-block" /></p>
                                        )
                                            : (
                                                <p className="text-sm text-muted-foreground">Cutomer Location: {currentAddress ?? "No address found"}</p>
                                            )
                                    }
                                    <p className="text-sm text-muted-foreground">Distance from you: {(getDistanceInMeters(incomingBooking.jobDetails.custLocation.latitude, incomingBooking.jobDetails.custLocation.longitude, latitude, longitude) / 1000).toFixed(2)} Km</p>
                                </CardDescription>
                            </div>
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                                {
                                    type === "worker" ? (
                                        <>
                                            <Button disabled={isBookingAccepted} className="cursor-pointer text-red-500" variant="outline" onClick={() => handleRejectBooking(incomingBooking.bookingId)}>Reject</Button>
                                            <Button disabled={isBookingAccepted} className="cursor-pointer text-green-500" variant="outline" onClick={() => handleAcceptBooking(incomingBooking.bookingId)}>Accept</Button>
                                            <Button disabled={!isBookingAccepted || outForService} className="cursor-pointer text-blue-500" variant="outline" onClick={() => handleOutForService(incomingBooking.bookingId)}>Out for Service</Button>
                                            <Button disabled={!outForService || !arrivedNearby || arrivedAtDestination} className="cursor-pointer text-green-500" variant="outline" onClick={handleStartWorking}>Arrived</Button>
                                            <Button disabled={workDoneInterval !== 0 || !arrivedAtDestination || isWorkDoneClicked} className="cursor-pointer text-green-500" variant="outline" onClick={handleWorkDone}>{workDoneInterval !== 0 ? `${workDoneInterval} sec` : "Done"}</Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button>Customer Buttons</Button>
                                        </>
                                    )
                                }
                            </div>
                        </CardContent>
                    </Card>
                )
            }
        </>
    )
}