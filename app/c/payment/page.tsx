'use client'

import { createRazorpayOrder } from "@/actions/createRazorpayOrder"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense, useEffect } from "react"

function PaymentContent() {
    const amount = useSearchParams().get('amount')

    useEffect(() => {
        if (amount) {
            (async () => {
                const order = await createRazorpayOrder(Number(amount))
                if(order.sucess){
                    console.log("success")
                    console.log(order)
                }else{
                    console.log("faliled")
                    console.log(order)
                }
            })()
        }
    }, [amount])

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