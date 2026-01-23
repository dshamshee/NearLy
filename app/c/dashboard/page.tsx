'use client';
import { findNearbyWorkers } from "@/actions/findNearbyWorkers";
import { Map } from "@/components/map";
import { RecentProfessionals } from "@/components/recentProfessionals";
import { Searching } from "@/components/searching";
import { zodSearchingType } from "@/zod/searching";
import Image from "next/image";
import { useState, useEffect } from "react";



export default function CustomerDashboard() {
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);
    const [bookingDetails, setBookingDetails] = useState<zodSearchingType | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [nearbyWorkers, setNearbyWorkers] = useState<any[] | null>(null);
    // const [nearbyWorkers, setNearbyWorkers] = useState
    // console.log("bookingDetails", bookingDetails);

    useEffect(() => {
        const getNearbyWorkers = async () => {
            if (!bookingDetails || !mapLoaded) return;
            const workers = await findNearbyWorkers(bookingDetails.custLocation.latitude, bookingDetails.custLocation.longitude);
            // console.log("workers", workers);
            if (workers && workers.length > 0) setNearbyWorkers(workers);
            
        }
        
        getNearbyWorkers();
    }, [bookingDetails, mapLoaded]);
    
    console.log("nearbyWorkers", nearbyWorkers);

    return (
        <div className="mainContainer min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">

            <div className="hero w-full flex md:flex-row flex-col items-center justify-between gap-10 md:px-16 py-5">
                <div className={`text text-center ${mapLoaded ? 'hidden' : 'block'}`}>
                    <h1 className="text-4xl font-bold text-foreground">Don&apos;t wait, get help now!</h1>
                    <p className="text-lg text-gray-500">Get instant access to skilled professionals in your neighborhood.</p>

                    <div className="search mt-4 ">
                        <Searching setBookingDetails={setBookingDetails} bookingDetails={bookingDetails} setMapLoaded={setMapLoaded} />
                    </div>


                </div>
                <div className={`${mapLoaded ? 'hidden' : 'block'}`}>
                    <div className={`illustration relative md:flex items-center justify-center hidden`}>
                        <Image src={'/custIllustration2.svg'} alt="Dashboard" width={600} height={600} className="relative z-0" />
                        <Image src={'/custIllustration1.svg'} alt="Dashboard" width={150} height={150} className="absolute z-20 top-1/7 left-1/5 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                </div>
                <div className={`mapSection w-full h-full ${mapLoaded ? 'block' : 'hidden'}`}>
                    <Map lat={bookingDetails?.custLocation.latitude ?? 0} lng={bookingDetails?.custLocation.longitude ?? 0} />
                </div>

            </div>

            {
                nearbyWorkers && nearbyWorkers.length > 0 ? (
                    // <h1>Here are some nearby workers</h1>
                    nearbyWorkers.map((worker)=>(
                        <h1 key={worker.userId._id.toString()}>{worker.userId.name}</h1>
                    ))
                ) :
                    (
                        // {/* Recently Booked Professionals */}

                        <div className="recentProfessionals mt-10">
                            <h2 className="md:text-2xl text-xl font-bold text-foreground mb-2">Recent Professionals</h2>
                            <div className="recentProfessionalsList grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <RecentProfessionals name="Mehul Dalvadi" avatar="https://github.com/shadcn.png" experience={10} location={4} rating={4.5} />
                                <RecentProfessionals name="Sivaniba Bhadoriya" avatar="https://github.com/shadcn.png" experience={5} location={2} rating={4.0} />
                                <RecentProfessionals name="Vivek Dave" avatar="https://github.com/shadcn.png" experience={3} location={1} rating={3.5} />
                            </div>
                        </div>
                    )
            }


        </div>
    )
}