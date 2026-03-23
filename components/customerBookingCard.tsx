"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { useCustomerStore } from "@/store/useCustomerStore";
import { useEffect, useState } from "react";
import { calculateDistance, formatDistance } from "@/helpers/calculateDistance";
import { Spinner } from "./ui/spinner";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Clock,
  CreditCard,
  FileText,
} from "lucide-react";
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
    yourOTP,
  } = useCustomerStore();
  const [distance, setDistance] = useState<string>("");

  useEffect(() => {
    if (!workerCurrentLocation || !bookingDetails) return;
    (async () => {
      const dist = await calculateDistance(
        Number(bookingDetails?.custLocation.latitude ?? 0),
        Number(bookingDetails?.custLocation.longitude ?? 0),
        Number(workerCurrentLocation?.latitude ?? 0),
        Number(workerCurrentLocation?.longitude ?? 0)
      );
      setDistance(formatDistance(dist));
    })();
  }, [workerCurrentLocation, bookingDetails]);

  const canPay = requestedPaymentAmount > 0 && requestedPaymentAmount !== null;

  return (
    <Card className="overflow-hidden border-border/50 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Booking Details</CardTitle>
        <CardDescription>
          Track your booking status and make payment when requested.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
            <FileText className="size-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Profession
              </p>
              <p className="font-medium">
                {(bookingDetails?.workNeededProfession ?? "")
                  .charAt(0)
                  .toUpperCase() +
                  (bookingDetails?.workNeededProfession ?? "").slice(1).toLowerCase()}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
            <CreditCard className="size-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Price Range
              </p>
              <p className="font-medium">₹{bookingDetails?.priceRange}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Description
          </p>
          <p className="text-foreground">{bookingDetails?.workNeededDescription}</p>
        </div>

        {distance && (
          <div className="flex items-center gap-3 rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
            <MapPin className="size-5 text-orange-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Distance from you
              </p>
              <p className="font-medium">{distance}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            disabled={!canPay || !trackingBookingId}
            asChild
            size="lg"
            className={`cursor-pointer flex-1 ${
              !canPay || !trackingBookingId ? "opacity-50 cursor-not-allowed" : ""
            } bg-orange-500 hover:bg-orange-600`}
          >
            <Link
              href={
                canPay && trackingBookingId
                  ? `/c/payment?bookingId=${trackingBookingId}`
                  : "#"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
              scroll={false}
            >
              Make Payment
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-6 border-t border-border/50 bg-muted/20 pt-6">
        {isBookingRejected ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-lg font-semibold text-destructive">
              Booking rejected. Please increase the price range and try again.
            </p>
          </div>
        ) : isBookingsent && !isBookingAccepted ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg font-semibold text-foreground">
              Waiting for worker to accept
            </p>
            <Spinner className="size-6 text-orange-500" data-icon="inline-start" />
          </div>
        ) : isBookingAccepted && !isWorkerOnTheWay ? (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle2 className="size-10 text-green-500" />
            <p className="text-lg font-semibold text-green-600">
              Booking confirmed! Worker has accepted.
            </p>
          </div>
        ) : isWorkerOnTheWay && !isWorkerArrived ? (
          <div className="flex flex-col items-center gap-3">
            <MapPin className="size-10 text-orange-500 animate-pulse" />
            <p className="text-lg font-semibold text-foreground">
              Worker is on the way
            </p>
            <p className="text-sm text-muted-foreground">
              Please wait for them to arrive.
            </p>
          </div>
        ) : null}

        {yourOTP && (
          <div className="flex flex-col items-center gap-2 p-6 rounded-xl bg-orange-500/10 border-2 border-orange-500/20">
            <Clock className="size-8 text-orange-500" />
            <p className="text-2xl font-bold tracking-[0.3em] text-orange-600">
              {yourOTP}
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Share this OTP with the worker to complete the service
            </p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
