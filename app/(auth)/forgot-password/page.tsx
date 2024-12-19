"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/app/(auth)/_components/input/auth-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/app/(auth)/_lib/auth-client";
import { forgotPasswordSchema } from "@/app/(auth)/_lib/auth-schema";
import SubmitButton from "@/app/(auth)/_components/button/submit-button";

export default function ForgotPassword() {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setIsPending(true);
    const { error } = await authClient.forgetPassword({
      email: data.email,
      redirectTo: "/reset-password",
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description:
          "If an account exists with this email, you will receive a password reset link.",
      });
    }
    setIsPending(false);
  };

  const isFormFilled = form.watch("email").trim() !== "";

  return (
    <>
      <Card className="w-full max-w-xs sm:max-w-sm lg:max-w-lg mx-auto my-28">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Forgot Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => {
                  const hasValue = field.value && field.value.trim() !== "";
                  const error = form.formState.errors.email;
                  const variant = !hasValue ? "default" : error ? "error" : "success";

                  return (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                          autoComplete="email"
                          variant={variant}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <SubmitButton 
                pending={isPending} 
                disabled={!isFormFilled} 
                className="w-full"
              >
                Send Reset Link
              </SubmitButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}