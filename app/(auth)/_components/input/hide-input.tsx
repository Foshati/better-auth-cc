"use client";

import { Input } from "@/app/(auth)/_components/input/auth-input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { UseControllerProps, FieldValues } from "react-hook-form";

interface InputHideProps {
  field: UseControllerProps<FieldValues>; // Proper typing from react-hook-form
  variant?: "default" | "error" | "success"; // Add variant for dynamic styling
}

export default function InputHide({ field, variant = "default" }: InputHideProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          {...field}
          className="pe-9"
          placeholder="password"
          type={isVisible ? "text" : "password"}
          variant={variant} // Pass variant for dynamic styling
        />
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 ring-offset-background transition-shadow hover:text-foreground focus-visible:border focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={toggleVisibility}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          aria-controls="password"
        >
          {isVisible ? (
            <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Eye size={16} strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
