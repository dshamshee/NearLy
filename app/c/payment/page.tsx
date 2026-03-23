'use client'

import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { useCustomerStore } from "@/store/useCustomerStore"
import { useSession } from "next-auth/react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import axios from "axios"

const AMOUNT_NOT_SET_MESSAGE = "Payment amount has not been set for this booking. Please wait for the worker to request payment.";

function PaymentContent() {
  const searchParams = useSearchParams();
  const bookingIdFromUrl = searchParams.get('bookingId');
  const { trackingBookingId, setIsPaymentReceived } = useCustomerStore();
  // Use bookingId from URL (passed when opening in new tab) or from store
  const bookingId = bookingIdFromUrl || trackingBookingId;
  const { data: session } = useSession();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load the Razorpay SDK
  const loadScript = async (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrder = useCallback(async () => {
    if (!bookingId) {
      setErrorMessage("Booking ID missing. Please return to the dashboard and try again.");
      setIsLoading(false);
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const response = await res.json();

      if (response.success && response.data) {
        setIsLoading(false);
        handleRazorPayScreen(response.data.id, response.data.amount);
      } else {
        setErrorMessage(response.message ?? "Failed to initialize payment");
        setIsLoading(false);
      }
    } catch (error: unknown) {
      console.log("Error in createOrder", error);
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
      setIsLoading(false);
    }
  }, [bookingId]);

  const handleRazorPayScreen = async (orderId: string, amountInPaise: number) => {
    const response = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!response) {
      alert("Razorpay SDK failed to load, please check the console for errors");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amountInPaise,
      currency: "INR",
      name: "NearLy",
      description: "Payment for the service",
      order_id: orderId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handler: async function (response: any) {
        // setResponseId(response.razorpay_payment_id);
        console.log(response);

        // set the response in the database (pass string; server converts to ObjectId)
        const data = {
          bookingId: bookingId as string,
          paymentId: response.razorpay_payment_id as string,
          orderId: response.razorpay_order_id as string,
        }

        // set the payment details in the database 
        const paymentResponse = await axios.post("/api/payment/details", data);

        if (paymentResponse.data.success) {
          toast.success("Payment successful!");
          setIsPaymentReceived(true);
          // API notifies dashboard via tracking server; delay close so user sees toast
          setTimeout(() => window.close(), 500);
        } else {
          toast.error(paymentResponse.data.message);
          // Notify dashboard of failure via tracking server
          const trackingUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
          fetch(`${trackingUrl.replace(/\/$/, "")}/notify-payment-result`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId, success: false }),
          }).catch(() => {});
          setTimeout(() => window.close(), 500);
        }

      },
      prefill: {
        name: session?.user?.name || "Customer Name",
        email: session?.user?.email || "customer@gmail.com",
        // contact: session?.user?. || "9976543210",
      },
      theme: {
        color: "#ffffff",
      },
    };

    const rzp1 = new window.Razorpay(options);


    rzp1.open();
  };

  useEffect(() => {
    if (bookingId) {
      createOrder();
    } else {
      setIsLoading(false);
    }
  }, [bookingId, createOrder]);

  if (errorMessage) {
    const isAmountNotSet = errorMessage.includes("amount has not been set");
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full px-4">
        <div className="max-w-md w-full rounded-lg border border-border bg-card p-6 text-center space-y-4">
          <p className="text-muted-foreground">{errorMessage}</p>
          {isAmountNotSet && (
            <p className="text-sm text-muted-foreground">
              Make sure the worker has clicked &quot;Request UPI Payment&quot; before you try again.
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => createOrder()} variant="default">
              Retry
            </Button>
            <Button asChild variant="outline">
              <Link href="/c/dashboard" scroll={false}>Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      {isLoading && <Skeleton className="w-full max-w-md" />}
    </div>
  );
}

export default function Payment() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  )
}