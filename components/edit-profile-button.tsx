"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EditProfileButtonProps {
  customerId: string;
}

export function EditProfileButton({ customerId }: EditProfileButtonProps) {
  return (
    <Button
      asChild
      variant="ghost"
      size="icon-sm"
      className="h-8 w-8 hover:bg-accent/50 transition-colors"
      aria-label="Edit profile"
      title="Edit profile"
    >
      <Link href={`/c/profile/${customerId}/edit`}>
        <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
      </Link>
    </Button>
  );
}

