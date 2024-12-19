import { Control, Controller } from "react-hook-form";
import { z } from "zod";
import { signUpSchema } from "@/app/(auth)/_lib/auth-schema";
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
      render={({ field }) => {
        const hasValue = field.value && field.value.trim() !== "";
        const error = control._formState.errors.password;
        const variant = !hasValue ? "default" : error ? "error" : "success";
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
