'use client'

import { createRazorpayOrder } from "@/actions/createRazorpayOrder"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function Payment() {

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
            <p>just checking the git branch</p>
            <p>just checking the git branch</p>
            <p>just checking the git branch</p>
            <p>just checking the git branch</p>
        </div>
    )
}