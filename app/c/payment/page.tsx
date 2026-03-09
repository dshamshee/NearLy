'use client'

import { createRazorpayOrder } from "@/actions/createRazorpayOrder"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense, useEffect } from "react"
import { toast } from "sonner"

function PaymentContent() {
    const amount = useSearchParams().get('amount')


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
            }else {
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
          description: "Payment for order",
          order_id: orderId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          handler: async function (response: any) {
            // setResponseId(response.razorpay_payment_id);
            console.log(response);
    
            // Create the order in the database
            // const responseOrder = await createOrderAPI(cartProducts, totalAmount, deliveryAddress._id, paymentMethod);
            // if(responseOrder.status === 200){
            //   console.log("Order created successfully");
            //   const responsePayment = await setPaymentDetails(response.razorpay_payment_id, responseOrder.data.order._id);
            //   if(responsePayment.status === 200){
            //     console.log("Payment details set successfully");
            //     navigate("/");
            //     window.location.reload();
            //   }else{
            //     console.log("Error in setting payment details");
            //   }
            // }else{
            //   console.log("Error in creating order");
            // }
          },
          prefill: {
            name: localStorage.getItem("userName") || "Customer Name",
            email: localStorage.getItem("userEmail") || "customer@gmail.com",
            contact: localStorage.getItem("userPhone") || "9976543210",
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
  



    // useEffect(() => {
    //     if (amount) {
    //         (async () => {
    //             const order = await createRazorpayOrder(Number(amount))
    //             if (order.success) {
    //                 console.log("success")
    //                 console.log(order)
    //             } else {
    //                 console.log("faliled")
    //                 console.log(order)
    //             }
    //         })()
    //     }
    // }, [amount])

    return (
        <div className="flex flex-col items-center justify-center h-screen w-full">
            <h1>Payment</h1>
            <Button asChild>
                <Link href="/c/dashboard" scroll={false}>Back to Dashboard</Link>
            </Button>
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