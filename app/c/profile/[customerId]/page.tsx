import { getUserDetails } from "@/actions/user";
import { getCustomerBookings } from "@/actions/getCustomerBookings";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CustomerProfileTabs } from "@/components/customer-profile-tabs";
import { GetServerSessionHere } from "@/app/api/auth/[...nextauth]/options";

export default async function CustomerProfilePage({
    params,
}: {
    params: Promise<{ customerId: string }>;
}) {
    const { customerId } = await params;

    const [customer, session, bookingsResult] = await Promise.all([
        getUserDetails(customerId),
        GetServerSessionHere(),
        getCustomerBookings(customerId),
    ]);

    const isOwnProfile =
        session?.user?._id != null && String(session.user._id) === String(customerId);

    const bookings = bookingsResult.success && bookingsResult.data ? bookingsResult.data : [];

    const customerData = {
        _id: customer._id.toString(),
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        avatar: customer.avatar,
        role: customer.role,
        createdAt: customer.createdAt,
    };

    const bookingsData = bookings.map((b: Record<string, unknown>) => ({
        _id: (b._id as { toString: () => string }).toString(),
        bookingDate: b.bookingDate,
        bookingTime: b.bookingTime,
        bookingStatus: b.bookingStatus,
        workNeededDescription: b.workNeededDescription ?? "",
        workNeededProfession: b.workNeededProfession ?? "",
        isWorkCompleted: b.isWorkCompleted,
        workerId: b.workerId,
    }));

    return (
        <div className="min-h-screen bg-background">
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    href="/c/dashboard"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground py-2 mb-6 transition-colors group"
                >
                    <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
                    Back to Dashboard
                </Link>

                <CustomerProfileTabs
                    customer={customerData}
                    bookings={bookingsData}
                    isOwnProfile={isOwnProfile}
                    customerId={customerId}
                />
            </div>
        </div>
    );
}
