'use client';
import { findNearbyWorkers } from "@/actions/findNearbyWorkers";
import { Map } from "@/components/map";
import { NearbyWorkers } from "@/components/nearbyWorkers";
import { RecentProfessionals } from "@/components/recentProfessionals";
import { Searching } from "@/components/searching";
import { Worker } from "@/types/worker";
import { zodSearchingType } from "@/zod/searching";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner"


export interface NearbyWorkerType extends Omit<Worker, 'userId'> {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        avatar: string;
    }
}


export default function CustomerDashboard() {
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);
    const [bookingDetails, setBookingDetails] = useState<zodSearchingType | null>(null);
    const [nearbyWorkers, setNearbyWorkers] = useState<NearbyWorkerType[] | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [trackingBookingId, setTrackingBookingId] = useState<string | null>(null);
    const [isBookingsent, setIsBookingsent] = useState<boolean>(false)

    const { data: session } = useSession();
    console.log(nearbyWorkers);

    useEffect(() => {
        // Initialize socket connection
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';
        const newSocket = io(socketUrl, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
        });
        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
        });
        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        setTimeout(() => {
            setSocket(newSocket)
        })

    }, [session])

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371e3; // Earth radius in meters
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d;
    }

    // Helper function to convert Decimal128 or number to number
    const toNumber = (value: number | { toString(): string } | undefined): number => {
        if (value === undefined || value === null) return 0;
        if (typeof value === 'number') return value;
        // Handle Decimal128 type (has toString method)
        if (typeof value === 'object' && 'toString' in value) {
            return parseFloat(value.toString());
        }
        return 0;
    }



    // Fin
    useEffect(() => {
        const getNearbyWorkers = async () => {
            if (!bookingDetails || !mapLoaded) return;

            // Validate location before making API call
            if (!bookingDetails.custLocation.latitude || !bookingDetails.custLocation.longitude) {
                console.error("Invalid location data:", bookingDetails.custLocation);
                return;
            }

            try {
                const workers = await findNearbyWorkers(bookingDetails.custLocation.latitude, bookingDetails.custLocation.longitude, bookingDetails.workNeededProfession);
                console.log("workers", workers);
                if (workers && workers.length > 0) {
                    setNearbyWorkers(workers);
                    toast.success("Fetched nearby workers successfully", { duration: 3000, position: 'top-center', description: "We found some professionals near you. Please check the list below." })
                } else {
                    console.log("No nearby workers found");
                    setNearbyWorkers([]);
                    toast.error("No nearby workers available", { duration: 3000, position: 'top-center', description: "We couldn't find any professionals near you. Please try again with a different location or profession." })
                }
            } catch (error) {
                console.error("Error fetching nearby workers:", error);
                toast.error("Something went wrong", { duration: 3000, position: 'top-center' })
            }
        }

        getNearbyWorkers();
    }, [bookingDetails, mapLoaded]);


    const sendBookingRequest = (workerId: string)=>{
        if (!socket || !socket.connected) {
            toast.error("Not connected to server. Please wait...");
            return;
        }
        
        if (!bookingDetails) {
            toast.error("Booking details are missing");
            return;
        }

        const bookingId = `${session?.user?._id}-${workerId}`;
        setTrackingBookingId(bookingId);
        
        socket.emit("send-booking-request", {
            bookingId: bookingId,
            selectedWorkerId: workerId,
            jobDetails: bookingDetails
        });
        
        console.log("Booking request sent:", { bookingId, selectedWorkerId: workerId });
        setIsBookingsent(true);
        toast.success("Booking request sent successfully");
    }


    return (
        <div className="mainContainer min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">

            <div className="hero w-full flex md:flex-row flex-col items-center justify-between gap-10 md:px-16 py-5">
                <div className={`text text-center ${mapLoaded ? 'hidden' : 'block'}`}>
                    <h1 className="text-4xl font-bold text-foreground">Don&apos;t wait, get help now!</h1>
                    <p className="text-lg text-gray-500">Get instant access to skilled professionals in your neighborhood.</p>

                    <div className="search mt-4 ">
                        <Searching
                            setBookingDetails={(data) => setBookingDetails(data)}
                            setMapLoaded={setMapLoaded}
                        />
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


            {nearbyWorkers && !isBookingsent && nearbyWorkers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{
                    nearbyWorkers.map((worker) => {
                        const distance = calculateDistance(
                            bookingDetails?.custLocation.latitude ?? 0,
                            bookingDetails?.custLocation.longitude ?? 0,
                            toNumber(worker.latitude),
                            toNumber(worker.longitude)
                        );
                    
                        return (
                            <NearbyWorkers
                                key={worker.userId._id.toString()}
                                avatar={worker.userId.avatar}
                                name={worker.userId.name}
                                experience={worker.workExperience ?? "0"}
                                distance={distance}
                                ratings={worker.averageRating ?? 0.0}
                                serviceCharge={worker.serviceCharge ?? 0}
                                sendBookingRequest={sendBookingRequest}
                                workerId={worker.userId._id}

                            />)
                    })}
                </div>
            ): (
                <div className="flex flex-col items-center justify-center gap-4">
                <h1>Wait for the worker to accept the booking</h1>
                <Spinner className="size-6" data-icon="inline-start" />
                </div>
                
            )
        }

            {!nearbyWorkers && (
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

{/*  */}