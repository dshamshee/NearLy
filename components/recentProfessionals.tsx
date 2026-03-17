"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase, MapPin, Star, ArrowRight } from "lucide-react";

export const RecentProfessionals = ({
  name,
  avatar,
  experience,
  location,
  rating,
}: {
  name: string;
  avatar: string;
  experience: number;
  location: number;
  rating: number;
}) => {
  return (
    <Card className="h-full border-border/50 transition-all duration-300 hover:border-orange-500/20 hover:shadow-lg group">
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 shrink-0 border-2 border-orange-500/20 group-hover:border-orange-500/40 transition-colors">
            <AvatarImage className="object-cover" src={avatar} alt={name} />
            <AvatarFallback className="bg-orange-500/10 text-orange-600 font-semibold">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{name}</h3>
            <div className="flex flex-wrap gap-3 mt-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Briefcase className="size-4 text-orange-500" />
                {experience} yrs
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-4 text-orange-500" />
                {location} km
              </span>
              <span className="flex items-center gap-1">
                <Star className="size-4 text-orange-500 fill-orange-500/30" />
                {rating}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 h-8 px-0 text-orange-500 hover:text-orange-600 hover:bg-orange-500/10 group/btn"
            >
              <span className="flex items-center gap-1">
                Book Again
                <ArrowRight className="size-4 group-hover/btn:translate-x-0.5 transition-transform" />
              </span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
