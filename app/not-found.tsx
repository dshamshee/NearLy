import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found | NearLy",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
        404
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        <span className="text-muted-foreground">Near</span>
        <span className="text-orange-500">Ly</span>
      </h1>
      <p className="mt-6 text-lg font-semibold text-foreground">
        Page not found
      </p>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved. Check the URL or go back to the home page.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button
          asChild
          className="bg-orange-500 text-white hover:bg-orange-600"
        >
          <Link href="/">
            <Home className="size-4" />
            Back to home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    </div>
  );
}
