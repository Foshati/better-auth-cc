import { Control, Controller } from "react-hook-form";
import { z } from "zod";
import { signUpSchema } from "@/app/(auth)/_lib/auth-schema";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import InputHide from "../../_components/input/hide-input";

type ConfirmPasswordInputProps = {
  control: Control<z.infer<typeof signUpSchema>>;
};

export default function ConfirmPasswordInput({ control }: ConfirmPasswordInputProps) {
  return (
    <Controller
    control={control}
    name="confirmPassword"
    render={({ field }) => {
      const hasValue = field.value && field.value.trim() !== "";
      const error = control._formState.errors.confirmPassword;
      const variant = !hasValue ? "default" : error ? "error" : "success";


        return (
          <FormItem>
            <div className="flex items-center justify-between max-w-2xl">
              <FormLabel>Confirm Password</FormLabel>
            </div>
            <FormControl>
              <InputHide 
                field={field} 
                variant={variant} // Apply variant dynamically
              />
            </FormControl>
            <FormMessage>{error?.message}</FormMessage>
          </FormItem>
        );
      }}
    />
  );
}
