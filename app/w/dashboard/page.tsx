import { GetServerSessionHere } from "@/app/api/auth/[...nextauth]/options";

export default async function WorkerDashboard() {
    const session = await GetServerSessionHere();
    console.log("Checking profile globally");

    return (
                <div className="flex flex-col mt-14 sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Welcome {session?.user?.name}</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your dashboard and receive bookings.
                        </p>
                    </div>
                </div>
    );
}