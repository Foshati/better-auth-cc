"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import InputSchema from "@/components/inputSchema";
import { signUpSchema } from "@/lib/auth-schema";
import { useState } from "react";
import LoadingButton from "@/components/loading-button";
import InputHide from "@/components/inputHide";

export default function SignUp() {
  const [pending, setPending] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
      },
      {
        onRequest: () => {
          setPending(true);
        },
        onSuccess: () => {
          toast({
            title: "Account created",
            description:
              "Your account has been created. Check your email for a verification link.",
          });
        },
        onError: (ctx) => {
          console.log("error", ctx);
          toast({
            title: "Something went wrong",
            description: ctx.error.message ?? "Something went wrong.",
          });
        },
      }
    );
    setPending(false);
  };

  return (
    <>
      <Card className="w-full max-w-xs sm:max-w-sm lg:max-w-lg mx-auto my-28">
        <CardHeader>
          <CardTitle className="font-bold text-3xl">Sign up</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <Input placeholder="Sam Foshati" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input placeholder="foshatia@gmail.com" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <InputSchema {...field} />
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

              <LoadingButton pending={pending}>Sign up</LoadingButton>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-xs font-medium text-slate-700">
            Already have an account?
          </p>
          <Link className="text-sm font-bold ml-2" href="/sign-in">
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
