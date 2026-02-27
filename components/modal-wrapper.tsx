"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function ModalWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back(); // Navigate back to the gallery/home when closed
    }
  };

  return (
    // defaultOpen={true} is critical because the route 
    // itself is what "triggers" the modal to exist
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        {/* Accessibility: Always include a Title or VisuallyHidden Title */}
        <VisuallyHidden>
          <DialogTitle>Modal View</DialogTitle>
        </VisuallyHidden>
        {children}
      </DialogContent>
    </Dialog>
  );
}