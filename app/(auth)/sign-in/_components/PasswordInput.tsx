"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import Link from "next/link";
import InputHide from "../../_components/input/hide-input";

export function PasswordInput({ control }: { control: any }) {
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
