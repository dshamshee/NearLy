'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import axios from "axios"
import Image from "next/image"
import { useState } from "react"





export default function Test() {
    const [qrCode, setQrCode] = useState<string | null> (null);


    const generateQRCode = async ()=>{        
        try {
            const response = await axios.post('/api/payment/generate-qr')
            console.log(response.data);
            console.log(response.data.data.image_url)
            setQrCode(response.data.data.image_url)
        } catch (error) {
            console.log("Error in generate QR code", error);
        }

    }


    return (
        <div className="flex flex-col items-center justify-center h-screen w-full">
            {/* <div className="skeleton flex flex-row items-center justify-center gap-4 w-full"> */}
            <Card className="w-full max-w-3xl">
                <CardHeader>
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="aspect-video w-full" />
                </CardContent>
            </Card>


            <h1>Please wait while we process your request</h1>
            {/* <Loader className="size-10 animate-spin" /> */}
            <Button onClick={generateQRCode} variant="default" className="mt-4">Generate QR Code</Button>
            {
                qrCode && (
                    <Image src={qrCode} alt="QR Code" width={200} height={200} className="mt-4" />
                )
            }
        </div>
    );
}