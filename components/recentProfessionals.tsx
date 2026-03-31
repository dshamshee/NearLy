  "use client";

  import { Button } from "@/components/ui/button";
  import { Card, CardContent } from "@/components/ui/card";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import { Star, ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";

  export const RecentProfessionals = ({
    name,
    avatar,
    profession,
    experience,
    rating,
    bookingDate,
    workerId,
  }: {
    name: string;
    avatar: string;
    profession: string;
    experience: number;
    rating: number;
    bookingDate: string;
    workerId: string;
  }) => {


    // const toSentenceCase = (str: string)=>{
    //   return str.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    // }

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    };

    const filledStars = Math.min(5, Math.max(0, Math.round(rating)));

    const formattedProfession = profession
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    return (
      <Card className="h-full w-full min-w-0 sm:min-w-[280px] md:min-w-[320px] border-border/50 transition-all duration-300 hover:border-orange-500/20 hover:shadow-lg group">
        <CardContent className="p-4 sm:pt-6 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <Avatar className="size-14 sm:size-16 shrink-0 border-2 border-orange-500/20 group-hover:border-orange-500/40 transition-colors">
                <AvatarImage className="object-cover" src={avatar} alt={name} />
                <AvatarFallback className="bg-orange-500/10 text-orange-600 font-semibold">
                  {name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 sm:flex-initial">
                <h3 className="font-semibold text-foreground truncate">{name}</h3>
                <p className="text-sm text-muted-foreground truncate mt-0.5">{formattedProfession}</p>
                <div className="flex items-center gap-0.5 mt-1.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`size-3.5 transition-colors shrink-0 ${i <= filledStars ? "fill-amber-500 text-amber-500" : "fill-transparent text-muted-foreground/40"}`}
                    />
                  ))}
                  <span className="ml-0.5 text-xs text-muted-foreground">({(rating ?? 0).toFixed(1)})</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-1 sm:min-w-0 sm:items-end sm:justify-center">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4 text-orange-500 shrink-0" />
                  {experience} yrs
                </span>
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <Calendar className="size-4 text-orange-500 shrink-0" />
                  {formatDate(bookingDate)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-11 cursor-pointer min-h-[44px] w-full sm:h-9 sm:min-h-0 sm:w-auto px-4 py-2.5 sm:px-3 sm:py-2 rounded-lg text-orange-500 hover:text-orange-600 hover:bg-orange-500/10 group/btn touch-manipulation justify-start sm:self-end transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Link href={`/feedback/${workerId.toString() ?? ""}`} className="w-full">
                    Give Feedback
                  </Link>
                  <ArrowRight className="size-4 group-hover/btn:translate-x-0.5 transition-transform shrink-0" />
                </span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
