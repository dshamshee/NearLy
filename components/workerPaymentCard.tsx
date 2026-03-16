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
import { generatePaymentOTP } from "@/actions/generatePaymentOTP";
import { verifyPaymentOTP } from "@/actions/verifyPaymentOTP";


export const WorkerPaymentCard = () => {

    const [paymentVerificationOTP, setPaymentVerificationOTP] = useState<string>("");
    const [resetAllStates, setResetAllStates ] = useState<boolean>(false);


    const { socket, isConnected } = useSocket();

    // Zustand store state and actions
    const {
        incomingBooking,
        isPaymentReceived,
        verifyPayment,
        makePayment,
        yourOTP,
        setIsPaymentReceived,
        setVerifyPayment,
        setYourOTP,
        setAmount,
        amount,
        resetBookingStates,
        resetPaymentFlow,
    } = useWorkerStore();


    // Function to handle the cash payment
    const handleCashPayment = async () => {
        setVerifyPayment(true);
        setIsPaymentReceived(true);
        // const otp = await generatePaymentOTP("WORKER", incomingBooking?.bookingId ?? "")
        // if(otp.success){
        //     setYourOTP(otp.data as string);
        // }else {
        //     toast.error(otp.message as string);
        // }
       
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
            // const otp = await generatePaymentOTP("WORKER", incomingBooking?.bookingId ?? "");
            // if(otp.success){
                // setYourOTP(otp.data as string);
                setVerifyPayment(true);
                setIsPaymentReceived(true);
            // }
        } else {
            toast.error("Amount must be at least ₹100", {
                position: 'top-right',
            });
        }
    }

    // Function to handle the payment verification
    const handlePaymentVerification = async () => {
        if(!socket || !isConnected){
            toast.error("Not connected to server. Please wait...", {
                position: 'top-right',
            });
            return;
        }

        const response = await verifyPaymentOTP("CUSTOMER", incomingBooking?.bookingId ?? "", paymentVerificationOTP)
        if(response.success){
            toast.success(response.message as string, {
                position: 'top-right',
            });
            // call this server action after verifying the OTP
            await isWorkCompleted(incomingBooking?.bookingId ?? "", true);
            setResetAllStates(true);
            socket.emit('confirm-payment-otp', {bookingId: incomingBooking?.bookingId ?? ""})
            
        }else {
            toast.error(response.message as string, {
                position: 'top-right',
            });
        }
    }


    // function to reset the booking and payment states 
    const handleResetAllStates = () => {
        if (socket && isConnected && incomingBooking?.bookingId) {
            socket.emit("service-ended", { bookingId: incomingBooking.bookingId });
        }
        resetBookingStates();
        resetPaymentFlow();
        setResetAllStates(false);
    }


    return (
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
                                <Button variant="outline" className={`cursor-pointer ${resetAllStates ? '' : 'hidden'}`} onClick={handleResetAllStates}>End Service</Button>
                            </div>
                        </CardContent>

                        {/* <CardFooter className="flex items-center justify-center gap-2">
                            <span className="text-sm text-muted-foreground flex flex-col items-center justify-center">
                                <p className="text-2xl font-bold text-primary">{yourOTP}</p>
                                <p className="text-center">Share this OTP with the customer to verify payment</p>
                            </span>
                        </CardFooter> */}
                    </Card>
                )
            }
        </>
    )
}