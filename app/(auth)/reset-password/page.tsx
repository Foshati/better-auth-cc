"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/(auth)/_lib/auth-client";
import { resetPasswordSchema } from "@/app/(auth)/_lib/auth-schema";
import { useToast } from "@/hooks/use-toast";
import SubmitButton from "@/app/(auth)/_components/button/submit-button";
import InputHide from "../_components/input/hide-input";

function ResetPasswordContent() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsPending(true);
    const { error } = await authClient.resetPassword({
      newPassword: data.password,
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
        description: "Password reset successful. Login to continue.",
      });
      router.push("/sign-in");
    }
    setIsPending(false);
  };

  if (error === "invalid_token") {
    return (
      <>
        <Card className="w-full max-w-xs sm:max-w-sm lg:max-w-lg mx-auto my-28">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-800">
              Invalid Reset Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-center text-gray-600">
                This password reset link is invalid or has expired.
              </p>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  const isFormFilled =
    form.watch("password").trim() !== "" &&
    form.watch("confirmPassword").trim() !== "";

  return (
    <>
      <Card className="w-full max-w-xs sm:max-w-sm lg:max-w-lg mx-auto my-28">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Reset Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  const hasValue = field.value && field.value.trim() !== "";
                  const error = form.formState.errors.password;
                  const variant = !hasValue ? "default" : error ? "error" : "success";

                  return (
                    <FormItem>
                      <div className="flex items-center justify-between max-w-2xl">
                        <FormLabel>Password</FormLabel>
                      </div>
                      <FormControl>
                        <InputHide field={field} variant={variant} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => {
                  const hasValue = field.value && field.value.trim() !== "";
                  const error = form.formState.errors.confirmPassword;
                  const variant = !hasValue ? "default" : error ? "error" : "success";

                  return (
                    <FormItem>
                      <div className="flex items-center justify-between max-w-2xl">
                        <FormLabel>Confirm Password</FormLabel>
                      </div>
                      <FormControl>
                        <InputHide field={field} variant={variant} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <SubmitButton pending={isPending} disabled={!isFormFilled} className="w-full">
                Reset Password
              </SubmitButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

export default function ResetPassword() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}