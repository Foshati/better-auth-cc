"use client";

import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import InputHide from "../../_components/input/hide-input";
import { z } from "zod";
import { signInSchema } from "@/app/(auth)/_lib/auth-schema";

export function PasswordInput({ control }: { control: Control<z.infer<typeof signInSchema>> }) {
  return (
    <FormField
      control={control}
      name="password"
      render={({ field }) => {
        const hasValue = field.value && field.value.trim() !== "";
        const error = control._formState.errors.password;
        const variant = !hasValue ? "default" : error ? "error" : "success";

        return (
          <FormItem>
            <div className="flex items-center justify-between max-w-2xl">
              <FormLabel>Password</FormLabel>
              <span>
                <Link
                  className="text-[10px] font-thin text-slate-900 hover:text-yellow-500"
                  href="/forgot-password"
                >
                  Forgot password
                </Link>
              </span>
            </div>
            <FormControl>
              <InputHide field={field} variant={variant} />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}