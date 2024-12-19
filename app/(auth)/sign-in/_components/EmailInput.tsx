"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/app/(auth)/_components/input/auth-input";

export function EmailInput({ control }: { control: any }) {
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
