"use client";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { IndianRupee, MapPin, Briefcase, Star, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export const NearbyWorkers = ({
  avatar,
  name,
  experience,
  distance,
  ratings,
  serviceCharge,
  sendBookingRequest,
  workerId,
}: {
  avatar: string;
  name: string;
  experience: string;
  distance: string;
  ratings: number;
  serviceCharge: number;
  sendBookingRequest: (workerId: string) => void;
  workerId: string;
}) => {
  return (
    <Card className="h-full overflow-hidden border-border/50 transition-all duration-300 hover:border-orange-500/30 hover:shadow-xl group">
      <CardHeader className="flex flex-row gap-4 pb-2">
        <Avatar className="size-16 md:size-20 shrink-0 border-2 border-orange-500/20 transition-colors group-hover:border-orange-500/40">
          <AvatarImage
            className="object-cover"
            src={avatar ?? "https://github.com/shadcn.png"}
            alt={name}
          />
          <AvatarFallback className="bg-orange-500/10 text-orange-600 font-semibold">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <CardContent className="flex-1 p-0 min-w-0">
          <h3 className="font-semibold text-foreground text-lg truncate">{name}</h3>
          <div className="flex flex-wrap gap-3 md:gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 text-orange-500 shrink-0" />
              {distance}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="size-4 text-orange-500 shrink-0" />
              {experience} yrs
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="size-4 text-orange-500 shrink-0 fill-orange-500/30" />
              {ratings}
            </span>
            <span className="flex items-center gap-1.5">
              <IndianRupee className="size-4 text-orange-500 shrink-0" />
              {serviceCharge}/day
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 w-full cursor-pointer border-orange-500/30 text-orange-600 hover:bg-orange-500/10 hover:border-orange-500/50 hover:text-orange-600 transition-all duration-300 group/btn"
            onClick={() => sendBookingRequest(workerId)}
          >
            <span className="flex items-center gap-2">
              Book Now
              <ArrowRight className="size-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </span>
          </Button>
        </CardContent>
      </CardHeader>
    </Card>
  );
};
