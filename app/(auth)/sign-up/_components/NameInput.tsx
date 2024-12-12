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
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input placeholder="Sam Foshati" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}