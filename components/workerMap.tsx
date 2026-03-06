'use client';
import { useWorkerStore } from "@/store/useWorkerStore";
import { Map } from "./map";

export const WorkerMap = () => {

       // Zustand store state and actions
       const {
        incomingBooking,
        location,
        isMapLoaded,
    } = useWorkerStore();

    const latitude = location.latitude;
    const longitude = location.longitude;


    return (
        <>
            {
                isMapLoaded && (
                    <div className="map">
                        <Map workerLat={latitude ?? 0} workerLng={longitude ?? 0} custLat={incomingBooking?.jobDetails?.custLocation?.latitude ?? 0} custLng={incomingBooking?.jobDetails?.custLocation?.longitude ?? 0} />
                    </div>
                )
            }
        </>
    )
}