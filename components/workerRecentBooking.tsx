import { Calendar, Clock, Briefcase, User, CheckCircle2, XCircle, Clock3 } from "lucide-react";


export const WorkerRecentBooking = ()=>{


    
    const recentBookings = [
        {
            id: '1',
            customerName: 'John Doe',
            workDescription: 'Fix leaking pipe in kitchen',
            profession: 'Plumbing',
            bookingDate: '2024-01-15',
            bookingTime: '2024-01-15T10:00:00',
            status: 'CONFIRMED',
        },
        {
            id: '2',
            customerName: 'Jane Smith',
            workDescription: 'Install new electrical outlets',
            profession: 'Electrical',
            bookingDate: '2024-01-14',
            bookingTime: '2024-01-14T14:30:00',
            status: 'COMPLETED',
        },
        {
            id: '3',
            customerName: 'Mike Johnson',
            workDescription: 'Repair broken cabinet door',
            profession: 'Carpentry',
            bookingDate: '2024-01-13',
            bookingTime: '2024-01-13T09:00:00',
            status: 'PENDING',
        },
        {
            id: '4',
            customerName: 'Sarah Williams',
            workDescription: 'Paint living room walls',
            profession: 'Painting',
            bookingDate: '2024-01-12',
            bookingTime: '2024-01-12T11:00:00',
            status: 'COMPLETED',
        },
        {
            id: '5',
            customerName: 'David Brown',
            workDescription: 'Deep clean entire apartment',
            profession: 'Cleaning',
            bookingDate: '2024-01-11',
            bookingTime: '2024-01-11T08:00:00',
            status: 'CANCELLED',
        },
    ];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            PENDING: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-300', icon: Clock3 },
            CONFIRMED: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300', icon: CheckCircle2 },
            COMPLETED: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', icon: CheckCircle2 },
            CANCELLED: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300', icon: XCircle },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                <Icon className="size-3" />
                {status}
            </span>
        );
    };


    return(
        <div className="bg-card mt-10 border border-border rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">Recent Bookings</h2>
                </div>

                {recentBookings.length === 0 ? (
                    <div className="text-center py-12">
                        <Briefcase className="size-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">No bookings yet</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            When you receive bookings, they will appear here
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <User className="size-4 text-muted-foreground" />
                                                    <span className="font-medium text-foreground">
                                                        {booking.customerName}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {booking.workDescription}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1.5">
                                                        <Briefcase className="size-4" />
                                                        {booking.profession}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="size-4" />
                                                        {formatDate(booking.bookingDate)}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="size-4" />
                                                        {formatTime(booking.bookingTime)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="shrink-0">
                                                {getStatusBadge(booking.status)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
    )
}