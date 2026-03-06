'use client';

import { Input } from "@/components/ui/input";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { useWorkerStore } from "@/store/useWorkerStore";
import { isWorkCompleted } from "@/actions/updateBooking";
import { toast } from "sonner";
import { useSocket } from "@/utils/socketContext";
import { useState } from "react";


export const WorkerPaymentCard = ()=>{

    const [paymentVerificationOTP, setPaymentVerificationOTP] = useState<string>("");


    const { socket, isConnected } = useSocket();

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




            // Function to handle the cash payment
    const handleCashPayment = () => {
        setVerifyPayment(true);
        setIsPaymentReceived(true);
        setYourOTP(Math.floor(100000 + Math.random() * 900000).toString());
    }

    // Function to handle the UPI payment
    const handleUPIPayment = async () => {
        if (amount > 0) {
            if (!socket || !isConnected) {
                toast.error("Not connected to server. Please wait...", {
                    position: 'top-right',
                });
                return;
            }
            socket.emit('request-payment', { bookingId: incomingBooking?.bookingId ?? "", amount });
            toast.success("Payment request sent successfully", { position: 'top-right' });
        } else {
            toast.error("Amount must be at least ₹100", {
                position: 'top-right',
            });
        }
    }

    // Function to handle the payment verification
    const handlePaymentVerification = async () => {
        await isWorkCompleted(incomingBooking?.bookingId ?? "", true);
    }


    return(
        <>
        {
                    makePayment && (
                        <Card className="mx-auto">
                            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-2">
                                <div>
                                    <CardTitle>
                                        <p className="text-lg font-semibold">{isPaymentReceived ? `Verify Payment` : "Make Payment"}</p>
                                    </CardTitle>
                                    <CardDescription className="flex flex-col items-center justify-center gap-2">
                                        <p className="text-sm text-muted-foreground">{isPaymentReceived ? "Please enter the customer's shared OTP to verify payment" : "Enter the amount to request for payment"}</p>
                                        <Input
                                            type="number"
                                            placeholder="Enter amount"
                                            className={`w-full ${isPaymentReceived ? 'hidden' : ''}`}
                                            value={amount}
                                            onChange={(e) => setAmount(Number(e.target.value))}
                                            min={100}
                                        />

                                        <InputOTP
                                            id="paymentVerificationOTP"
                                            className={`${isPaymentReceived ? '' : 'hidden'}`}
                                            maxLength={6}
                                            value={paymentVerificationOTP?.toString()}
                                            onChange={(value) => setPaymentVerificationOTP(value)}
                                        >
                                            <InputOTPGroup className={`${isPaymentReceived ? '' : 'hidden'}`}>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator className={`${isPaymentReceived ? '' : 'hidden'}`} />
                                            <InputOTPGroup className={`${isPaymentReceived ? '' : 'hidden'}`}>
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </CardDescription>
                                </div>

                                <div className="flex items-center justify-center gap-2">
                                    <Button variant="outline" className={`cursor-pointer px-10 ${isPaymentReceived ? 'hidden' : ''}`} onClick={handleCashPayment}>Cash</Button>
                                    <Button variant="outline" className={`cursor-pointer px-10 ${isPaymentReceived ? 'hidden' : ''}`} onClick={handleUPIPayment}>UPI</Button>
                                    <Button disabled={!verifyPayment} variant="outline" className={`cursor-pointer ${isPaymentReceived ? '' : 'hidden'}`} onClick={handlePaymentVerification}>Verify Payment</Button>
                                </div>
                            </CardContent>

                            <CardFooter className="flex items-center justify-center gap-2">
                            <span className="text-sm text-muted-foreground flex flex-col items-center justify-center">
                                        <p className="text-2xl font-bold text-primary">{yourOTP}</p>
                                        <p className="text-center">Share this OTP with the customer to verify payment</p>
                                    </span>
                            </CardFooter>
                        </Card>
                    )
                }
        </>
    )
}