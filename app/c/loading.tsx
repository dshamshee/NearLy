import { LoadingSkeleton } from "@/components/loadingSkeleton";

export default function Loading(){
    return(
        <div className="flex flex-col items-center justify-center h-screen w-full">
            <LoadingSkeleton />
        </div>
    )
}