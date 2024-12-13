import { Control, Controller } from "react-hook-form";
import { z } from "zod";
import { signUpSchema } from "@/lib/auth-schema";
import { Input } from "@/components/ui/input";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

type NameInputProps = {
  control: Control<z.infer<typeof signUpSchema>>;
};

export default function NameInput({ control }: NameInputProps) {
  return (
    <Controller
      control={control}
      name="name"
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
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Sam Foshati"
                {...field}
                variant={variant} // Dynamically set the variant
              />
            </FormControl>
            <FormMessage>{error?.message}</FormMessage>
          </FormItem>
        );
      }}
    />
  );
}
