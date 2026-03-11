'use client'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { useCustomerStore } from "@/store/useCustomerStore";
import { useEffect, useState } from "react";
import { calculateDistance } from "@/utils/calculateDistance";
import { Spinner } from "./ui/spinner";
import { ArrowRight } from "lucide-react";
import Link from "next/link";


export const CustomerBookingCard = () => {
    const {
        bookingDetails,
        isBookingsent,
        isBookingAccepted,
        isBookingRejected,
        isWorkerArrived,
        isWorkerOnTheWay,
        workerCurrentLocation,
        requestedPaymentAmount,
        trackingBookingId,
    } = useCustomerStore();
    const [distance, setDistance] = useState<number>(0);


    // Calculate distance between customer and worker
    useEffect(() => {
        if (!workerCurrentLocation || !bookingDetails) return;
        (async () => {
            const distance = await calculateDistance(
                Number(bookingDetails?.custLocation.latitude ?? 0),
                Number(bookingDetails?.custLocation.longitude ?? 0),
                Number(workerCurrentLocation?.latitude ?? 0),
                Number(workerCurrentLocation?.longitude ?? 0)
            );
            setDistance(distance);
        })()
    }, [workerCurrentLocation, bookingDetails])


    return (
        <Card>
            <CardHeader>
                <CardTitle>Booking Details</CardTitle>
            </CardHeader>

            <CardContent className="flex md:flex-row flex-col md:items-center md:justify-between gap-2 items-start justify-start">
                <CardDescription>
                    <p>Profession: {(bookingDetails?.workNeededProfession ?? "").charAt(0).toUpperCase() + (bookingDetails?.workNeededProfession ?? "").slice(1).toLowerCase()}</p>
                    <p>Description: {bookingDetails?.workNeededDescription}</p>
                    <p>Price Range: ₹{bookingDetails?.priceRange}</p>
                    <p>Distance from you: {(distance / 1000).toFixed(2)} Km</p>
                </CardDescription>


                <CardAction className="mt-5 w-full md:w-auto">
                    <Button disabled={requestedPaymentAmount <= 0 || requestedPaymentAmount === null} asChild className={`cursor-pointer w-full md:w-auto ${requestedPaymentAmount <= 0 || requestedPaymentAmount === null ? 'opacity-50 cursor-not-allowed' : ''}`} variant="outline">
                        <Link href={requestedPaymentAmount <= 0 || requestedPaymentAmount === null ? '#' : `/c/payment?amount=${requestedPaymentAmount}${trackingBookingId ? `&bookingId=${trackingBookingId}` : ''}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2" scroll={false}>
                            Make Payment
                            <ArrowRight className="size-4 inline-block" />
                        </Link>
                    </Button>
                </CardAction>
            </CardContent>
            <CardFooter className="flex flex-col items-center justify-center gap-4">
                {isBookingRejected ? (
                    <div className="flex flex-col items-center justify-center gap-4">
                        <h1 className="text-xl font-semibold text-red-600">Booking rejected by worker, please increase the price range and try again</h1>
                    </div>
                ) : isBookingsent && !isBookingAccepted ? (
                    <div className="flex flex-col items-center justify-center gap-4">
                        <h1 className="text-xl font-semibold">Wait for the worker to accept the booking</h1>
                        <Spinner className="size-6" data-icon="inline-start" />
                    </div>
                ) : isBookingAccepted && !isWorkerOnTheWay ? (
                    <div className="flex flex-col items-center justify-center gap-4">
                        <h1 className="text-xl font-semibold text-green-600">Booking confirmed! Worker has accepted your request.</h1>
                    </div>
                ) : isWorkerOnTheWay && !isWorkerArrived ? (
                    <div className="flex flex-col items-center justify-center gap-4">
                        <h1 className="text-xl font-semibold text-green-600">Worker is on the way, please wait for them to arrive.</h1>
                    </div>
                ) : isBookingRejected ? (
                    <div className="flex flex-col items-center justify-center gap-4">
                        <h1 className="text-xl font-semibold text-red-600">Booking rejected by worker, please increase the price range and try again.</h1>
                    </div>
                ) : null}
            </CardFooter>
        </Card>
    )
}