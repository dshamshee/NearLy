import { getUserDetails } from "@/actions/user";
import { getCustomerBookings } from "@/actions/getCustomerBookings";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CustomerProfileTabs } from "@/components/customer-profile-tabs";
import { GetServerSessionHere } from "@/app/api/auth/[...nextauth]/options";
import { notFound } from "next/navigation";

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

    if (!customer.success || !customer.data) {
        notFound();
    }

    const user = customer.data as {
        _id: { toString: () => string };
        name: string;
        email: string;
        phone?: string;
        avatar?: string;
        role: string;
        createdAt?: Date;
    };

    const customerData = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt,
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
        <div className="min-h-screen mt-14 bg-background">
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
