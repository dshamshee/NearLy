'use client';

import { findNearbyWorkers } from "@/actions/findNearbyWorkers";
import { Map } from "@/components/map";
import { NearbyWorkers } from "@/components/nearbyWorkers";
import { RecentProfessionals } from "@/components/recentProfessionals";
import { Searching } from "@/components/searching";
import { useCustomerStore } from "@/store/useCustomerStore";
import type { CustomerNearbyWorker } from "@/store/useCustomerStore";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useSocket } from "@/utils/socketContext";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";
import { createBooking } from "@/actions/createBooking";
import { CustomerBookingCard } from "@/components/customerBookingCard";
import { generatePaymentOTP } from "@/actions/generatePaymentOTP";
import { calculateDistance, formatDistance } from "@/helpers/calculateDistance";
import { motion } from "motion/react";

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
    setIsBookingAccepted,
    isBookingRejected,
    setIsBookingRejected,
    setIsWorkerArrived,
    setIsWorkerOnTheWay,
    setIsServiceStarted,
    workerCurrentLocation,
    setWorkerCurrentLocation,
    setRequestedPaymentAmount,
    increasePrice,
    resetAfterRejection,
    setYourOTP,
  } = useCustomerStore();

  const searchParams = useSearchParams();
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (searchParams.get("login") === "success" && typeof window !== "undefined") {
      toast.success("Login Successful");
      const url = new URL(window.location.href);
      url.searchParams.delete("login");
      window.history.replaceState({}, "", url.pathname + (url.search || ""));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!socket) return;
    const handlePaymentResult = (data: { bookingId?: string; success: boolean }) => {
      if (data.success) {
        const bookingIdToUse = data.bookingId ?? trackingBookingId;
        if (!bookingIdToUse) {
          toast.error("Booking ID not found. Please refresh the page.", {
            position: "top-right",
          });
          return;
        }
        toast.success("Payment successful, please share the OTP with the worker to complete the service", {
          position: "top-right",
        });
        (async () => {
          toast.info("Generating payment OTP...", {
            position: "top-right",
          });
          const otp = await generatePaymentOTP("CUSTOMER", bookingIdToUse);
          if (otp.success) {
            toast.success(otp.message as string, {
              position: "top-right",
            });
            setYourOTP(otp.data as string);
            socket.emit("confirm-payment", { bookingId: bookingIdToUse });
          } else {
            toast.error(otp.message as string, {
              position: "top-right",
            });
          }
        })();
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
  }, [socket, setTrackingBookingId, setYourOTP, trackingBookingId]);

  useEffect(() => {
    if (!socket) return;

    const handleBookingConfirmed = () => {
      setIsBookingAccepted(true);
      toast.success("Worker accepted your booking!", {
        position: "top-right",
      });
    };

    const handleBookingError = (error: unknown) => {
      const message =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message: unknown }).message === "string"
          ? (error as { message: string }).message
          : "Booking request failed";
      toast.error(message, {
        position: "top-right",
      });
      setTimeout(() => {
        setIsBookingsent(false);
      }, 2000);
    };

    const handleBookingRejected = (data: { msg: string }) => {
      toast.error(data.msg || "Booking rejected by worker", {
        position: "top-right",
      });
      setIsBookingAccepted(false);
      setIsBookingRejected(true);
      setTimeout(() => {
        setIsBookingsent(false);
      }, 3000);
    };

    const handleBookingRejectedError = (error: { message: string }) => {
      toast.error(error.message || "Something went wrong", {
        position: "top-right",
      });
      setIsBookingAccepted(false);
      setIsBookingRejected(false);
    };

    const handleWorkerStartedNavigation = () => {
      setIsWorkerOnTheWay(true);
      toast.success("Worker is on the way", {
        position: "top-right",
      });
    };

    const handleStartNavigationError = (error: { message: string }) => {
      toast.error(error.message || "Something went wrong", {
        position: "top-right",
      });
      setIsWorkerOnTheWay(false);
    };

    const handleLocationBroadcast = (location: { latitude: number; longitude: number }) => {
      setWorkerCurrentLocation(location);
    };

    const handleUpdateLocationError = (error: { message: string }) => {
      toast.error(error.message || "Something went wrong", {
        position: "top-right",
      });
      setWorkerCurrentLocation(null);
    };

    const handleWorkerArrived = () => {
      setIsWorkerArrived(true);
      setIsServiceStarted(true);
      setMapLoaded(false);
      toast.success("Service has started", {
        position: "top-right",
      });
    };

    const handleConfirmReachedError = (error: { message: string }) => {
      toast.error(error.message || "Something went wrong", {
        position: "top-right",
      });
      setIsWorkerArrived(false);
      setIsServiceStarted(false);
      setMapLoaded(true);
    };

    const handlePaymentRequested = (data: { amount: number }) => {
      toast.success("Worker has requested for payment", {
        position: "top-right",
      });
      setRequestedPaymentAmount(data.amount);
    };

    const handlePaymentError = (error: { message: string }) => {
      toast.error(error.message || "Something went wrong", {
        position: "top-right",
      });
    };

    const handlePaymentOTPConfirmed = (data: { success: boolean }) => {
      if (data.success) {
        toast.success("Payment verified! Service completed.", {
          position: "top-right",
        });
        useCustomerStore.getState().resetAllStates();
      } else {
        toast.error("payment OTP verification failed", {
          position: "top-right",
        });
      }
    };

    const handlePaymentOTPError = (error: { message: string }) => {
      toast.error(error.message || "Something went wrong", {
        position: "top-right",
      });
    };

    const handleServiceEnded = (data: { success?: boolean }) => {
      if (data.success) {
        useCustomerStore.getState().resetAllStates();
      }
    };

    socket.on("booking-confirmed", handleBookingConfirmed);
    socket.on("booking-request-error", handleBookingError);
    socket.on("booking-rejected", handleBookingRejected);
    socket.on("booking-rejected-error", handleBookingRejectedError);
    socket.on("worker-started-navigation", handleWorkerStartedNavigation);
    socket.on("location-broadcast", handleLocationBroadcast);
    socket.on("worker-arrived", handleWorkerArrived);
    socket.on("start-navigation-error", handleStartNavigationError);
    socket.on("update-location-error", handleUpdateLocationError);
    socket.on("confirm-reached-error", handleConfirmReachedError);
    socket.on("payment-requested", handlePaymentRequested);
    socket.on("payment-error", handlePaymentError);
    socket.on("payment-otp-confirmed", handlePaymentOTPConfirmed);
    socket.on("payment-otp-error", handlePaymentOTPError);
    socket.on("service-ended", handleServiceEnded);

    return () => {
      socket.off("booking-confirmed", handleBookingConfirmed);
      socket.off("booking-request-error", handleBookingError);
      socket.off("booking-rejected", handleBookingRejected);
      socket.off("booking-rejected-error", handleBookingRejectedError);
      socket.off("worker-started-navigation", handleWorkerStartedNavigation);
      socket.off("location-broadcast", handleLocationBroadcast);
      socket.off("worker-arrived", handleWorkerArrived);
      socket.off("start-navigation-error", handleStartNavigationError);
      socket.off("update-location-error", handleUpdateLocationError);
      socket.off("confirm-reached-error", handleConfirmReachedError);
      socket.off("payment-requested", handlePaymentRequested);
      socket.off("payment-error", handlePaymentError);
      socket.off("payment-otp-confirmed", handlePaymentOTPConfirmed);
      socket.off("payment-otp-error", handlePaymentOTPError);
      socket.off("service-ended", handleServiceEnded);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !isConnected || !trackingBookingId) return;

    const timeoutId = setTimeout(() => {
      if (socket.connected && trackingBookingId) {
        socket.emit("update-customer-socket", { bookingId: trackingBookingId });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [socket, isConnected, trackingBookingId]);

  useEffect(() => {
    const getNearbyWorkers = async () => {
      if (!bookingDetails || !mapLoaded) return;

      if (!bookingDetails.custLocation.latitude || !bookingDetails.custLocation.longitude) {
        console.error("Invalid location data:", bookingDetails.custLocation);
        return;
      }

      try {
        setFetchingNearbyWorkers(true);
        const workers = await findNearbyWorkers(
          bookingDetails.custLocation.latitude,
          bookingDetails.custLocation.longitude,
          bookingDetails.workNeededProfession
        );
        if (workers && workers.length > 0) {
          setNearbyWorkers(workers);
          toast.success("Fetched nearby workers successfully", {
            duration: 3000,
            position: "top-center",
            description: "We found some professionals near you. Please check the list below.",
          });
        } else {
          setNearbyWorkers([]);
          toast.error("No nearby workers available", {
            duration: 3000,
            position: "top-center",
            description:
              "We couldn't find any professionals near you. Please try again with a different location or profession.",
          });
        }
      } catch (error) {
        console.error("Error fetching nearby workers:", error);
        toast.error("Something went wrong", {
          duration: 3000,
          position: "top-center",
        });
      } finally {
        setFetchingNearbyWorkers(false);
      }
    };

    getNearbyWorkers();
  }, [bookingDetails, mapLoaded]);

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
      bookingDetails: bookingDetails,
    };

    const newBooking = await createBooking(booking);

    setTrackingBookingId(newBooking.bookingId?.toString() ?? null);

    setIsBookingsent(true);
    setIsBookingRejected(false);
    socket.emit(
      "send-booking-request",
      {
        bookingId: newBooking.bookingId?.toString() ?? null,
        selectedWorkerId: workerId,
        jobDetails: bookingDetails,
      },
      (response: { success?: boolean; error?: string } | undefined) => {
        if (response?.error) {
          toast.error(response.error, { position: "top-right" });
          setIsBookingsent(false);
        } else {
          toast.success("Booking request sent successfully", { position: "top-right" });
        }
      }
    );
  };

  const handleIncreasePrice = () => increasePrice();
  const handleCancelIncreasePrice = () => resetAfterRejection();

  return (
    <div className="mainContainer min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="hero w-full flex md:flex-row flex-col items-center justify-between gap-10 md:px-16 py-5">
        {!isBookingsent && (
          <>
            <div className="text text-center">
              <h1 className="text-4xl font-bold text-foreground">
                Don&apos;t wait, get help now!
              </h1>
              <p className="text-lg text-gray-500">
                Get instant access to skilled professionals in your neighborhood.
              </p>

              <div className="search mt-4">
                <Searching
                  setBookingDetails={(data) => setBookingDetails(data)}
                  setMapLoaded={setMapLoaded}
                />
              </div>
            </div>
            <div>
              <div className="illustration relative md:flex items-center justify-center hidden">
                <Image
                  src="/CustIllustration2.svg"
                  alt="Dashboard"
                  width={600}
                  height={600}
                  className="relative z-0"
                />
                <Image
                  src="/CustIllustration1.svg"
                  alt="Dashboard"
                  width={150}
                  height={150}
                  className="absolute z-20 top-1/7 left-1/5 -translate-x-1/2 -translate-y-1/2"
                />
              </div>
            </div>
          </>
        )}
        {isBookingsent && mapLoaded && (
          <motion.div
            className="mapSection w-full h-full rounded-xl overflow-hidden border border-border/50 shadow-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-[400px] md:h-[500px] w-full">
            <Map
              workerLat={workerCurrentLocation?.latitude ?? 0}
              workerLng={workerCurrentLocation?.longitude ?? 0}
              custLat={bookingDetails?.custLocation.latitude ?? 0}
              custLng={bookingDetails?.custLocation.longitude ?? 0}
            />
            </div>
          </motion.div>
        )}
      </div>

      {isBookingRejected && !isBookingsent && (
        <motion.div
          className="mb-6 flex justify-center"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="relative inline-flex">
                <svg className="absolute inset-0 w-full h-full rounded-lg overflow-visible">
                  <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    rx="8"
                    ry="8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    pathLength="1"
                    strokeDasharray="0.08 0.92"
                    strokeLinecap="round"
                    className="text-orange-500"
                    style={{
                      strokeDashoffset: 1,
                      animation: "border-rotate 3s linear infinite",
                    }}
                  />
                </svg>
                <Button
                  variant="outline"
                  className="cursor-pointer px-8 py-6 shadow-md border-0 bg-background relative z-10 rounded-lg hover:bg-orange-500/10 hover:text-orange-500 hover:border-orange-500/30 transition-all"
                >
                  Increase Price & Try Again
                </Button>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Booking Rejected</AlertDialogTitle>
                <AlertDialogDescription>
                  The worker has rejected your booking request. Please increase
                  the price range and try again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleCancelIncreasePrice}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleIncreasePrice}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Increase by ₹100
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      )}

      {nearbyWorkers && nearbyWorkers.length > 0 && !isBookingsent && (
        <section className="py-8 md:py-12 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Nearby Professionals
              </h2>
              <p className="text-muted-foreground">
                Select a professional to send a booking request.
              </p>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="initial"
              animate="animate"
              variants={{
                initial: {},
                animate: {
                  transition: {
                    staggerChildren: 0.08,
                    delayChildren: 0.1,
                  },
                },
              }}
            >
              {nearbyWorkers.map((worker) => {
            const dist = calculateDistance(
              Number(bookingDetails?.custLocation.latitude ?? 0),
              Number(bookingDetails?.custLocation.longitude ?? 0),
              Number(worker.latitude),
              Number(worker.longitude)
            );
            const distance = formatDistance(dist);

            return (
              <motion.div
                key={worker.userId._id.toString()}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                }}
              >
                <NearbyWorkers
                  avatar={worker.userId.avatar}
                  name={worker.userId.name}
                  experience={worker.workExperience ?? "0"}
                  distance={distance}
                  ratings={worker.averageRating ?? 0.0}
                  serviceCharge={worker.serviceCharge ?? 0}
                  sendBookingRequest={sendBookingRequest}
                  workerId={String(worker.userId._id)}
                />
              </motion.div>
            );
          })}
            </motion.div>
          </div>
        </section>
      )}

      {isBookingsent && (
        <section className="py-8 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CustomerBookingCard />
            </motion.div>
          </div>
        </section>
      )}

      {!mapLoaded && (
        <section className="py-12 md:py-20 px-4 md:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Recent Professionals
              </h2>
              <p className="text-muted-foreground">
                Professionals you&apos;ve worked with before.
              </p>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                initial: {},
                animate: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.1,
                  },
                },
              }}
            >
              {[
                { name: "Mehul Dalvadi", avatar: "https://github.com/shadcn.png", experience: 10, location: 4, rating: 4.5 },
                { name: "Sivaniba Bhadoriya", avatar: "https://github.com/shadcn.png", experience: 5, location: 2, rating: 4.0 },
                { name: "Vivek Dave", avatar: "https://github.com/shadcn.png", experience: 3, location: 1, rating: 3.5 },
              ].map((pro) => (
                <motion.div
                  key={pro.name}
                  variants={{
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                  }}
                >
                  <RecentProfessionals
                    name={pro.name}
                    avatar={pro.avatar}
                    experience={pro.experience}
                    location={pro.location}
                    rating={pro.rating}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {fetchingNearbyWorkers && (
        <motion.section
          className="py-16 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="size-14 rounded-2xl bg-orange-500/10 flex items-center justify-center">
              <Spinner className="size-8 text-orange-500" data-icon="inline-start" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground">
                Finding nearby professionals...
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Please wait while we search your area
              </p>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
