'use client';
import { findNearbyWorkers } from "@/actions/findNearbyWorkers";
import { Map } from "@/components/map";
import { NearbyWorkers } from "@/components/nearbyWorkers";
import { RecentProfessionals } from "@/components/recentProfessionals";
import { Searching } from "@/components/searching";
import { useCustomerStore } from "@/store/useCustomerStore";
import type { CustomerNearbyWorker } from "@/store/useCustomerStore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner"
import { useSocket } from "@/utils/socketContext";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { createBooking } from "@/actions/createBooking";
import { CustomerBookingCard } from "@/components/customerBookingCard";


export type NearbyWorkerType = CustomerNearbyWorker;


export default function CustomerDashboard() {
    const {
        mapLoaded,
        setMapLoaded,
        bookingDetails,
        setBookingDetails,
        nearbyWorkers,
        setNearbyWorkers,
        fetchingNearbyWorkers,
        setFetchingNearbyWorkers,
        trackingBookingId,
        setTrackingBookingId,
        isBookingsent,
        setIsBookingsent,
        isBookingAccepted,
        setIsBookingAccepted,
        isBookingRejected,
        setIsBookingRejected,
        isWorkerArrived,
        setIsWorkerArrived,
        isWorkerOnTheWay,
        setIsWorkerOnTheWay,
        setIsServiceStarted,
        workerCurrentLocation,
        setWorkerCurrentLocation,
        setRequestedPaymentAmount,
        increasePrice,
        resetAfterRejection,
    } = useCustomerStore();

    const searchParams = useSearchParams();
    const { socket, isConnected } = useSocket();

    // Show login success toast when redirected from login
    useEffect(() => {
        if (searchParams.get("login") === "success" && typeof window !== "undefined") {
            toast.success("Login Successful");
            const url = new URL(window.location.href);
            url.searchParams.delete("login");
            window.history.replaceState({}, "", url.pathname + (url.search || ""));
        }
    }, [searchParams]);

    // Listen for payment success/failure from payment tab via socket
    useEffect(() => {
        if (!socket) return;
        console.log("I am here")
        const handlePaymentResult = (data: { bookingId?: string; success: boolean }) => {
            if (data.success) {
                toast.success("Payment successful, please share the OTP with the worker to complete the service", {
                    position: "top-right",
                });
                if (data.bookingId) setTrackingBookingId(data.bookingId);
            } else {
                toast.error("Payment failed, please try again", {
                    position: "top-right",
                });
                if (data.bookingId) setTrackingBookingId(data.bookingId);
            }
        };
        socket.on("customer-payment-result", handlePaymentResult);
        return () => {
            socket.off("customer-payment-result", handlePaymentResult);
        };
    }, [socket, setTrackingBookingId]);

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

        const handleBookingError = (error: unknown) => {
            const message = (typeof error === "object" && error !== null && "message" in error && typeof (error as { message: unknown }).message === "string")
                ? (error as { message: string }).message
                : "Booking request failed";
            console.error("Booking error:", message, error);
            toast.error(message, {
                position: 'top-right',
            });

            setTimeout(() => { setIsBookingsent(false); }, 2000)

        };

        const handleBookingRejected = (data: { msg: string }) => {
            toast.error(data.msg || "Booking rejected by worker", {
                position: 'top-right',
            });
            setIsBookingAccepted(false);
            setIsBookingRejected(true);
            setTimeout(() => { setIsBookingsent(false); }, 3000)
        }

        const handleBookingRejectedError = (error: { message: string }) => {
            toast.error(error.message || "Something went wrong", {
                position: 'top-right',
            });
            setIsBookingAccepted(false);
            setIsBookingRejected(false);
        }

        const handleWorkerStartedNavigation = () => {
            setIsWorkerOnTheWay(true);
            toast.success("Worker is on the way", {
                position: 'top-right',
            });
        }

        const handleStartNavigationError = (error: { message: string }) => {
            toast.error(error.message || "Something went wrong", {
                position: 'top-right',
            });
            setIsWorkerOnTheWay(false);
        }

        const handleLocationBroadcast = (location: { latitude: number, longitude: number }) => {
            setWorkerCurrentLocation(location);
        }

        const handleUpdateLocationError = (error: { message: string }) => {
            toast.error(error.message || "Something went wrong", {
                position: 'top-right',
            });
            setWorkerCurrentLocation(null);
        }

        const handleWorkerArrived = () => {
            setIsWorkerArrived(true);
            setIsServiceStarted(true);
            setMapLoaded(false);
            toast.success("Service has started", {
                position: 'top-right',
            });
        }

        const handleConfirmReachedError = (error: { message: string }) => {
            toast.error(error.message || "Something went wrong", {
                position: 'top-right',
            });
            setIsWorkerArrived(false);
            setIsServiceStarted(false);
            setMapLoaded(true);
        }

        const handlePaymentRequested = (data: { amount: number }) => {
            toast.success("Worker has requested for payment", {
                position: 'top-right',
            });
            setRequestedPaymentAmount(data.amount);
            console.log("Payment Requested: ", data);
        }

        const handlePaymentError = (error: { message: string }) => {
            toast.error(error.message || "Something went wrong", {
                position: 'top-right',
            });
            // setIsPaymentReceived(false);
        }

        socket.on("booking-confirmed", handleBookingConfirmed);
        socket.on("booking-request-error", handleBookingError);
        socket.on("booking-rejected", handleBookingRejected);
        socket.on("booking-rejected-error", handleBookingRejectedError);
        socket.on("worker-started-navigation", handleWorkerStartedNavigation);
        socket.on('location-broadcast', handleLocationBroadcast);
        socket.on("worker-arrived", handleWorkerArrived);
        socket.on("start-navigation-error", handleStartNavigationError);
        socket.on("update-location-error", handleUpdateLocationError);
        socket.on("confirm-reached-error", handleConfirmReachedError);
        socket.on("payment-requested", handlePaymentRequested);
        socket.on("payment-error", handlePaymentError);

        return () => {
            socket.off("booking-confirmed", handleBookingConfirmed);
            socket.off("booking-request-error", handleBookingError);
            socket.off("booking-rejected", handleBookingRejected);
            socket.off("booking-rejected-error", handleBookingRejectedError);
            socket.off("worker-started-navigation", handleWorkerStartedNavigation);
            socket.off('location-broadcast', handleLocationBroadcast);
            socket.off("worker-arrived", handleWorkerArrived);
            socket.off("payment-requested", handlePaymentRequested);
            socket.off("payment-error", handlePaymentError);
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

    // Function to calculate the distance between two coordinates in meters
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




    // Find nearby workers
    useEffect(() => {
        const getNearbyWorkers = async () => {
            if (!bookingDetails || !mapLoaded) return;

            // Validate location before making API call
            if (!bookingDetails.custLocation.latitude || !bookingDetails.custLocation.longitude) {
                console.error("Invalid location data:", bookingDetails.custLocation);
                return;
            }

            try {
                setFetchingNearbyWorkers(true);
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
            } finally {
                setFetchingNearbyWorkers(false);
            }
        }

        getNearbyWorkers();
    }, [bookingDetails, mapLoaded]);


    // Function to send a booking request to a worker
    const sendBookingRequest = async (workerId: string) => {
        if (!socket || !isConnected) {
            toast.error("Not connected to server. Please wait...");
            return;
        }

        if (!bookingDetails) {
            toast.error("Booking details are missing");
            return;
        }

        const booking = {
            workerId: workerId,
            bookingDetails: bookingDetails
        }

        const newBooking = await createBooking(booking)

        // const bookingId = `${session?.user?._id}-${workerId}`;
        setTrackingBookingId(newBooking.bookingId?.toString() ?? null);

        setIsBookingsent(true);
        setIsBookingRejected(false);
        socket.emit("send-booking-request", {
            bookingId: newBooking.bookingId?.toString() ?? null,
            selectedWorkerId: workerId,
            jobDetails: bookingDetails
        }, (response: { success?: boolean; error?: string } | undefined) => {
            if (response?.error) {
                toast.error(response.error, { position: 'top-right' });
                setIsBookingsent(false);
            } else {
                toast.success("Booking request sent successfully", { position: 'top-right' });
            }
        });

        console.log("Booking request sent:", { bookingId: newBooking.bookingId?.toString() ?? null, selectedWorkerId: workerId });
    }

    const handleIncreasePrice = () => increasePrice();

    const handleCancelIncreasePrice = () => resetAfterRejection();


    return (
        <div className="mainContainer min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">

            <div className="hero w-full flex md:flex-row flex-col items-center justify-between gap-10 md:px-16 py-5">
                {
                    !isBookingsent && (
                        <>
                            <div className={`text text-center`}>
                                <h1 className="text-4xl font-bold text-foreground">Don&apos;t wait, get help now!</h1>
                                <p className="text-lg text-gray-500">Get instant access to skilled professionals in your neighborhood.</p>

                                <div className="search mt-4 ">
                                    <Searching
                                        setBookingDetails={(data) => setBookingDetails(data)}
                                        setMapLoaded={setMapLoaded}
                                    />
                                </div>


                            </div>
                            <div>
                                <div className={`illustration relative md:flex items-center justify-center hidden`}>
                                    <Image src={'/CustIllustration2.svg'} alt="Dashboard" width={600} height={600} className="relative z-0" />
                                    <Image src={'/CustIllustration1.svg'} alt="Dashboard" width={150} height={150} className="absolute z-20 top-1/7 left-1/5 -translate-x-1/2 -translate-y-1/2" />
                                </div>
                            </div>
                        </>
                    )
                }
                {
                    isBookingsent && mapLoaded && (
                        <div className={`mapSection w-full h-full`}>
                            <Map workerLat={workerCurrentLocation?.latitude ?? 0} workerLng={workerCurrentLocation?.longitude ?? 0} custLat={bookingDetails?.custLocation.latitude ?? 0} custLng={bookingDetails?.custLocation.longitude ?? 0} />
                        </div>
                    )
                }
            </div>

            {/* Modal for increasing price when booking is rejected */}
            {isBookingRejected && !isBookingsent && (
                <div className="mb-3 flex justify-center">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <div className="relative inline-flex">
                                <svg className="absolute inset-0 w-full h-full rounded-md overflow-visible">
                                    <rect
                                        x="0" y="0"
                                        width="100%" height="100%"
                                        rx="8" ry="8"
                                        fill="none"
                                        stroke="#3b82f6"
                                        strokeWidth="3"
                                        pathLength="1"
                                        strokeDasharray="0.08 0.92"
                                        strokeLinecap="round"
                                        style={{ strokeDashoffset: 1, animation: 'border-rotate 3s linear infinite' }}
                                    />
                                </svg>
                                <Button variant="outline" className="cursor-pointer px-14 shadow-md border-0 bg-background relative z-10 rounded-md hover:bg-accent">Increase</Button>
                            </div>

                        </AlertDialogTrigger>
                        <AlertDialogContent size="sm">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Booking Rejected</AlertDialogTitle>
                                <AlertDialogDescription>
                                    The worker has rejected your booking request. Please increase the price range and try again.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={handleCancelIncreasePrice}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleIncreasePrice}>Increase by 100 Rs</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )
            }

            {/* Nearby Worker Cards */}
            {nearbyWorkers && nearbyWorkers.length > 0 && !isBookingsent && (
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
                                workerId={String(worker.userId._id)}

                            />)
                    })}
                </div>
            )}

            { // Customer Booking Card
                isBookingsent && (
                    <CustomerBookingCard />
                )
            }

            {/* Recent Professionals */}
            {!mapLoaded && (
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

            {
                fetchingNearbyWorkers && (
                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                        <Spinner className="size-6" data-icon="inline-start" />
                        <h1 className="text-xl font-semibold text-green-600">Fetching nearby workers...</h1>
                    </div>
                )
            }
        </div>
    )
}
