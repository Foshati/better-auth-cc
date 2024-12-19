import { Control, Controller } from "react-hook-form";
import { z } from "zod";
import { signUpSchema } from "@/app/(auth)/_lib/auth-schema";
import { Input } from "@/app/(auth)/_components/input/auth-input";
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
    render={({ field }) => {
      const hasValue = field.value && field.value.trim() !== "";
      const error = control._formState.errors.name;
      const variant = !hasValue ? "default" : error ? "error" : "success";

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
