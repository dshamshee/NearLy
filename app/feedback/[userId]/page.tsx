"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Star, ArrowLeft, Sparkles, Loader2, Send } from "lucide-react";
import { use, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { User } from "@/types/user";
import { Worker } from "@/types/worker";
import { getWorker } from "@/actions/getworker";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";


interface WorkerWithUser extends Omit<Worker, "userId"> {
    userId: User;
}

const RATING_LABELS: Record<number, string> = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very good",
    5: "Excellent",
};

export default function FeedbackPage({params}: {params: {userId: string}}) {
    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [worker, setWorker]= useState<WorkerWithUser | null>(null)
    const displayRating = hoverRating || rating;

    const router = useRouter();

    const {userId} = use(params as unknown as Promise<{userId: string}>);
    // console.log('userId: ', userId);

    useEffect(()=>{

        (async()=>{
            const response = await getWorker(userId);
            if(response.success){
                setWorker(response.data as WorkerWithUser);
            }
        })()

    }, [userId])

    const handleSubmit = async () => {
        console.log("rating: ", rating, "comment: ", comment);

        try {
            setIsSubmitting(true);
            const response = await axios.post("/api/worker/feedback", {
                userId,
                rating,
                comment,
            })
            if (response.data.success) {
                toast.success(response.data.message, {
                    position: "top-right",
                    duration: 5000,
                });
                setRating(0);
                setComment("");
                router.back();
            }
            else {
                setError(response.data.message);
                toast.error(response.data.message);
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) toast.error(error.response?.data.message || "An error occurred during submission");
            else toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <div className="relative w-full bg-background font-sans min-h-[calc(100vh-4rem)]">
            <section className="relative overflow-hidden pt-20 pb-16 px-4 md:px-8">
                <div className="absolute inset-0 bg-linear-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-24 right-1/4 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 mx-auto max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        <Link
                            href="/c/dashboard"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                        >
                            <ArrowLeft className="size-4" />
                            Back to dashboard
                        </Link>

                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="size-5 text-amber-500" aria-hidden />
                            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                                How was your service?
                            </h1>
                        </div>
                        <p className="text-muted-foreground text-sm md:text-base mb-8 max-w-md">
                            Your feedback helps workers improve and helps other customers choose
                            trusted professionals.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.08 }}
                    >
                        <Card className="border-border/80 shadow-md">
                            <CardHeader className="border-b border-border/60 pb-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="size-14 border-2 border-muted">
                                        <AvatarFallback className="text-lg font-medium bg-muted">
                                            {worker?.userId?.name?.charAt(0)}
                                        </AvatarFallback>
                                        <AvatarImage
                                            src={worker?.userId?.avatar}
                                            alt={worker?.userId?.name}
                                        />
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <CardTitle className="text-lg truncate">
                                            {worker?.userId?.name}
                                        </CardTitle>
                                        <CardDescription className="mt-0.5">
                                            {worker?.profession}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6 pt-6">
                                <div className="space-y-3">
                                    <Label
                                        htmlFor="feedback-rating"
                                        className="text-base font-medium"
                                    >
                                        Overall rating
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Tap a star from 1 (poor) to 5 (excellent).
                                    </p>
                                    <div
                                        id="feedback-rating"
                                        className="flex flex-wrap items-center gap-2"
                                        role="group"
                                        aria-label="Star rating from 1 to 5"
                                    >
                                        {[1, 2, 3, 4, 5].map((value) => {
                                            const active = displayRating >= value;
                                            return (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    className="p-1 rounded-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                    onMouseEnter={() => setHoverRating(value)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setRating(value)}
                                                    aria-pressed={rating === value}
                                                    aria-label={`${value} star${value === 1 ? "" : "s"}`}
                                                >
                                                    <Star
                                                        className={`size-9 md:size-10 transition-colors ${active
                                                                ? "fill-amber-400 text-amber-500"
                                                                : "fill-transparent text-muted-foreground/40"
                                                            }`}
                                                        strokeWidth={active ? 0 : 1.5}
                                                    />
                                                </button>
                                            );
                                        })}
                                        {displayRating > 0 && (
                                            <span className="text-sm text-muted-foreground ml-1 tabular-nums">
                                                {RATING_LABELS[displayRating]}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label htmlFor="feedback-comment" className="text-base font-medium">
                                        Tell us more
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Optional details help the worker and our team understand your experience.
                                    </p>
                                    <Textarea
                                        id="feedback-comment"
                                        placeholder="What went well? Anything we should know?"
                                        className="min-h-[120px] resize-y"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        maxLength={2000}
                                    />
                                    <p className="text-xs text-muted-foreground text-right tabular-nums">
                                        {comment.length} / 2000
                                    </p>
                                </div>
                            </CardContent>

                            <CardFooter className="flex flex-col gap-3 border-t border-border/60 pt-6">
                                <Button onClick={handleSubmit} type="button" className="w-full cursor-pointer" size="lg" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <span className="flex items-center gap-2 group">Submit feedback <Send className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></span>}
                                </Button>
                                {error && <p className="text-xs text-red-500">{error}</p>}
                            </CardFooter>
                        </Card>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
