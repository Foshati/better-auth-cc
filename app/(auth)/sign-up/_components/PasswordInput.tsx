import { Control, Controller } from "react-hook-form";
import { z } from "zod";
import { signUpSchema } from "@/lib/auth-schema";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import InputSchema from "../../_components/input/hard-input";

type PasswordInputProps = {
  control: Control<z.infer<typeof signUpSchema>>;
};

export default function PasswordInput({ control }: PasswordInputProps) {
  return (
    <Controller
      control={control}
      name="password"
      render={({ field, fieldState: { error, isTouched, isDirty } }) => {
        const hasValue = field.value && field.value.trim() !== "";

        const variant = !hasValue
          ? "default" // Default state when input is empty
          : error
          ? "error" // Red border if there's a validation error
          : isTouched && isDirty
          ? "success" // Green border if value is valid
          : "default";

        return (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <InputSchema
                {...field}
                variant={variant} // Pass variant dynamically
                />
            </FormControl>
            <FormMessage>{error?.message}</FormMessage>
          </FormItem>
        );
      }}
    />
  );
}
