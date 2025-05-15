"use client";

import { useFormStatus } from "react-dom";

import { LoaderIcon } from "@/components/custom/icons";

import { Button } from "../ui/button";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type={pending ? "button" : "submit"}
      aria-disabled={pending}
      className="relative text-primary-foreground bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus-visible:ring-orange-500"
    >
      {children}
      {pending && (
        <span className="animate-spin absolute right-4">
          <LoaderIcon />
        </span>
      )}
      <span aria-live="polite" className="sr-only" role="status">
        {pending ? "Loading" : "Submit form"}
      </span>
    </Button>
  );
}
