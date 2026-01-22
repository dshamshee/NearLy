import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"


export const LoadingSkeleton = ()=>{

    return(
<div className="flex flex-col items-center justify-center h-screen w-full">
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
        </div>
    )
}