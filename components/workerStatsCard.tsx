import { Briefcase, IndianRupeeIcon } from "lucide-react"

export const WorkerStatsCard = () => {

    const totalEarnings = 125000;
    const totalBookings = 47;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Earnings Card */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                        <p className="text-3xl font-bold text-foreground mt-2">
                            ₹{totalEarnings.toLocaleString('en-IN')}
                        </p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-full">
                        {/* <DollarSign className="size-6 text-primary" /> */}
                        <IndianRupeeIcon className="size-6 text-primary dark:text-primary/80" />

                    </div>
                </div>
            </div>

            {/* Total Bookings Card */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                                <p className="text-3xl font-bold text-foreground mt-2">
                                    {totalBookings}
                                </p>
                            </div>
                            <div className="bg-blue-500/10 p-3 rounded-full">
                                <Briefcase className="size-6 text-blue-500" />
                            </div>
                        </div>
                    </div>
        </div>
    )
}