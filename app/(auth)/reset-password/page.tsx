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
import { authClient } from "@/lib/auth-client";
import { resetPasswordSchema } from "@/lib/auth-schema";
import { useToast } from "@/hooks/use-toast";
import LoadingButton from "@/components/loading-button";
import InputHide from "@/components/inputHide";

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
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between max-w-2xl">
                      <FormLabel>password</FormLabel>
                    </div>
                    <FormControl>
                      <InputHide field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between max-w-2xl">
                      <FormLabel>confirmPassword</FormLabel>
                    </div>
                    <FormControl>
                      <InputHide field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <LoadingButton pending={isPending}>Reset Password</LoadingButton>
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
