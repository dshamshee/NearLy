'use client'

import { createRazorpayOrder } from "@/actions/createRazorpayOrder"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense, useEffect } from "react"
import { toast } from "sonner"
import { useCustomerStore } from "@/store/useCustomerStore"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import axios from "axios"



function PaymentContent() {
  const amount = useSearchParams().get('amount')
  const { trackingBookingId } = useCustomerStore()
  const { data: session } = useSession();
  const router = useRouter();


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

  const createOrder = async (amount: number) => {

    try {
      // Send a request to the server action to create a Razorpay order
      const response = await createRazorpayOrder(amount)
      if (response.success && response.data) {
        handleRazorPayScreen(response.data.id, response.data.amount)
      } else {
        toast.error("Faild to initilize payment")
      }
    } catch (error: unknown) {
      console.log("Error in createOrder", error)
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    }
  }

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
          bookingId: trackingBookingId as string,
          paymentId: response.razorpay_payment_id as string,
          orderId: response.razorpay_order_id as string,
        }
        // const res = await fetch("/api/payment/details", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(data),
        // });

        const paymentResponse = await axios.post("/api/payment/details", data);

        if (paymentResponse.data.success) {
          toast.success(paymentResponse.data.message);
          router.push("/c/dashboard")
          window.location.reload();
        } else {
          toast.error(paymentResponse.data.message);
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
    createOrder(Number(amount));
  }, [amount]);


  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">

      {/* Skeleton */}
      <Skeleton />
      {/* <h1>Payment</h1>
      <Button asChild>
        <Link href="/c/dashboard" scroll={false}>Back to Dashboard</Link>
      </Button> */}
    </div>
  )
}

export default function Payment() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  )
}