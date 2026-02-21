import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Loader } from "@/components/ui/loader"
import { Skeleton } from "@/components/ui/skeleton"




export default function Test() {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-full">
            {/* <div className="skeleton flex flex-row items-center justify-center gap-4 w-full"> */}
            <Card className="w-full max-w-3xl">
                <CardHeader>
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="aspect-video w-full" />
                </CardContent>
            </Card>

            <h1>Please wait while we process your request</h1>
            {/* <Loader className="size-10 animate-spin" /> */}
        </div>
    )
}