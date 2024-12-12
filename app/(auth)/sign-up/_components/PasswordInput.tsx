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
      render={({ field }) => (
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <InputSchema {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}