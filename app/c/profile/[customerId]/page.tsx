import { getUserDetails } from "@/actions/user";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { EditProfileDialog } from "@/components/edit-profile-dialog";

export default async function CustomerProfile({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;
  const customer = await getUserDetails(customerId);

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatRole = (role: string) => {
    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              {customer.avatar ? (
                <Image
                  src={customer.avatar}
                  alt={customer.name}
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-primary/20"
                />
              ) : (
                <div className="w-[120px] h-[120px] rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
                  <span className="text-4xl font-bold text-primary">
                    {customer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-card-foreground">
                  {customer.name}
                </h1>
                <EditProfileDialog
                  customerId={customerId}
                  initialData={{
                    name: customer.name,
                    phone: customer.phone,
                    avatar: customer.avatar,
                  }}
                />
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                {formatRole(customer.role)}
              </div>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-card-foreground mb-6">
            Profile Information
          </h2>

          <div className="space-y-6">
            {/* Email */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="w-full sm:w-48 shrink-0">
                <span className="text-sm font-medium text-muted-foreground">
                  Email Address
                </span>
              </div>
              <Separator orientation="vertical" className="hidden sm:block h-6" />
              <div className="flex-1">
                <p className="text-base text-card-foreground break-all">
                  {customer.email}
                </p>
              </div>
            </div>

            <Separator />

            {/* Phone */}
            {customer.phone && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="w-full sm:w-48 shrink-0">
                    <span className="text-sm font-medium text-muted-foreground">
                      Phone Number
                    </span>
                  </div>
                  <Separator orientation="vertical" className="hidden sm:block h-6" />
                  <div className="flex-1">
                    <p className="text-base text-card-foreground">
                      {customer.phone}
                    </p>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Role */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="w-full sm:w-48 shrink-0">
                <span className="text-sm font-medium text-muted-foreground">
                  Account Type
                </span>
              </div>
              <Separator orientation="vertical" className="hidden sm:block h-6" />
              <div className="flex-1">
                <span className="inline-flex items-center px-3 py-1 rounded-md bg-secondary text-secondary-foreground text-sm font-medium">
                  {formatRole(customer.role)}
                </span>
              </div>
            </div>

            {customer.createdAt && (
              <>
                <Separator />
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="w-full sm:w-48 shrink-0">
                    <span className="text-sm font-medium text-muted-foreground">
                      Member Since
                    </span>
                  </div>
                  <Separator orientation="vertical" className="hidden sm:block h-6" />
                  <div className="flex-1">
                    <p className="text-base text-card-foreground">
                      {formatDate(customer.createdAt)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
