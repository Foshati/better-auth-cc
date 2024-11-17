// src/app/reset-password/page.tsx
"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/hooks/use-toast";
import { resetPasswordSchema } from "@/lib/auth-schema";

export default function ResetPassword() {
  const router = useRouter();
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    const { data, error } = await authClient.resetPassword({
      newPassword: values.password,
    });

    if (error) {
      toast({
        title: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Password reset successfully",
    });
    router.push("/sign-in");
  }

  return (
    <Card className="max-w-md mx-auto my-28">
      <CardHeader>
        <CardTitle className="font-bold text-3xl">Reset Password</CardTitle>
        <CardDescription>
          Please enter your new password below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Reset Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}