import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { IndianRupeeIcon, MapPinIcon, NotepadText, StarIcon } from "lucide-react"
import { Button } from "./ui/button"


export const NearbyWorkers = (
    { avatar, name, experience, distance, ratings, serviceCharge, sendBookingRequest, workerId }
    : { avatar: string, name: string, experience: string, distance: number, ratings: number,
         serviceCharge: number, sendBookingRequest: (workerId: string) => void, workerId: string }) => {
    

    return (
     <Card className="md:w-[410px]">
        <CardHeader className="flex flex-row">
            <Avatar className="w-20 h-20 bg-red-400">
                <AvatarImage className="object-cover" src={avatar ?? "https://github.com/shadcn.png"} alt={name} />
                <AvatarFallback className="bg-red-400">NA</AvatarFallback>
            </Avatar>
            <CardContent className=" p-1">
            <CardTitle>{name}</CardTitle>
            <CardDescription className="flex flex-row text-xs gap-4 md:gap-8 w-full mt-4 items-center">
                <div className="flex gap-1 flex-col items-center">
                <MapPinIcon className="size-4 text-blue-500" /> {(distance / 1000).toFixed(1)} KM
                </div>
                <div className="flex gap-1 flex-col items-center">
                <NotepadText className="size-4 text-green-500" /> {experience}
                </div>
                <div className="flex gap-1 flex-col items-center">
                <StarIcon className="size-4 text-yellow-500" /> {ratings}
                </div>
                <div className="flex gap-1 flex-col items-center">
                <IndianRupeeIcon className="size-4 text-red-500" /> {serviceCharge}/Day
                </div>
            </CardDescription>

            <CardAction className="self-center w-full mt-4 ml-3">
                <Button variant="outline" size="sm" className="w-full" onClick={(()=> sendBookingRequest(workerId))}>Book Now</Button>
            </CardAction>
            </CardContent>
        </CardHeader>
     </Card>   
    )
}