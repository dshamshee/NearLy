'use client';
import { Map } from "@/components/map";
import { RecentProfessionals } from "@/components/recentProfessionals";
import { Searching } from "@/components/searching";
import Image from "next/image";
import { useState } from "react";

export default function CustomerDashboard(){
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);

    return (
        <div className="mainContainer min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">

            <div className="hero w-full flex md:flex-row flex-col items-center justify-between gap-10 md:px-16 py-5">
            <div className={`text text-center ${mapLoaded ? 'hidden' : 'block'}`}>
                <h1 className="text-4xl font-bold text-foreground">Don&apos;t wait, get help now!</h1>
                <p className="text-lg text-gray-500">Get instant access to skilled professionals in your neighborhood.</p>

                <div className="search mt-4 ">
                    <Searching />
                </div>
                
            
            </div>
            <div className={`${mapLoaded ? 'hidden' : 'block'}`}>
            <div className={`illustration relative flex items-center justify-center hidden md:block`}>
                <Image src={'/custIllustration2.svg'} alt="Dashboard" width={600} height={600} className="relative z-0" />
                <Image src={'/custIllustration1.svg'} alt="Dashboard" width={150} height={150} className="absolute z-20 top-1/7 left-1/5 -translate-x-1/2 -translate-y-1/2" />
            </div>
            </div>
            <div className={`mapSection w-full h-full ${mapLoaded ? 'block' : 'hidden'}`}>
                <Map />
            </div>

            </div>

            {/* Recently Booked Professionals */}
            <div className="recentProfessionals mt-10">
                <h2 className="md:text-2xl text-xl font-bold text-foreground mb-2">Recent Professionals</h2>
                <div className="recentProfessionalsList grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <RecentProfessionals name="Mehul Dalvadi" avatar="https://github.com/shadcn.png" experience={10} location={4} rating={4.5} />
                    <RecentProfessionals name="Sivaniba Bhadoriya" avatar="https://github.com/shadcn.png" experience={5} location={2} rating={4.0} />
                    <RecentProfessionals name="Vivek Dave" avatar="https://github.com/shadcn.png" experience={3} location={1} rating={3.5} />
                </div>
            </div>
        </div>
    )
}