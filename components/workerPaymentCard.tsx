'use client';

import { Input } from "@/components/ui/input";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
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
        await isWorkCompleted(incomingBooking?.bookingId ?? "", true, amount);
        setResetAllStates(true); // Cash: no OTP needed, go straight to End Service
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
            await isWorkCompleted(incomingBooking?.bookingId ?? "", true, amount);
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
            {makePayment && (
                <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-border">
                        <h3 className="text-lg font-semibold text-foreground">
                            {isPaymentReceived ? "Verify Payment" : "Collect Payment"}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {isPaymentReceived
                                ? "Enter the 6-digit OTP shared by the customer"
                                : "Request payment from the customer"}
                        </p>
                    </div>
                    <div className="p-5 space-y-4">
                        {!isPaymentReceived ? (
                            <>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">
                                        Amount (min ₹100)
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 500"
                                        className="max-w-[180px]"
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        min={100}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        variant="outline"
                                        className="cursor-pointer"
                                        onClick={handleCashPayment}
                                    >
                                        Cash
                                    </Button>
                                    <Button
                                        className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white"
                                        onClick={handleUPIPayment}
                                    >
                                        Request UPI
                                    </Button>
                                </div>
                            </>
                        ) : resetAllStates ? (
                            <div className="flex items-center justify-between gap-4 py-2">
                                <p className="text-sm text-muted-foreground">
                                    Payment verified. End the service to complete.
                                </p>
                                <Button
                                    className="cursor-pointer bg-green-600 hover:bg-green-700 text-white"
                                    onClick={handleResetAllStates}
                                >
                                    End Service
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">
                                        OTP
                                    </label>
                                    <InputOTP
                                        id="paymentVerificationOTP"
                                        maxLength={6}
                                        value={paymentVerificationOTP?.toString()}
                                        onChange={(value) => setPaymentVerificationOTP(value)}
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                <Button
                                    disabled={!verifyPayment}
                                    className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white"
                                    onClick={handlePaymentVerification}
                                >
                                    Verify OTP
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}