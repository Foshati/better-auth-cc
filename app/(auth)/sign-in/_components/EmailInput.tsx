"use client";

import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/app/(auth)/_components/input/auth-input";
import { z } from "zod";
import { signInSchema } from "@/app/(auth)/_lib/auth-schema";

export function EmailInput({ control }: { control: Control<z.infer<typeof signInSchema>> }) {
  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => {
        const hasValue = field.value && field.value.trim() !== "";
        const error = control._formState.errors.email;
        const variant = !hasValue ? "default" : error ? "error" : "success";

        return (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                placeholder="foshatia@gmail.com"
                {...field}
                variant={variant}
              />
            </FormControl>
            <FormMessage>{error?.message}</FormMessage>
          </FormItem>
        );
      }}
    />
  );
}