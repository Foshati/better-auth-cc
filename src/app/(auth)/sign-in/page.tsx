"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { formSchemaSignin } from "@/lib/auth-schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/hooks/use-toast";
import Button43 from "@/components/auth/socialsButtonts";

export default function Signup() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchemaSignin>>({
    resolver: zodResolver(formSchemaSignin),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchemaSignin>) {
    const { email, password } = values;
    const { data, error } = await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/dashboard",
      },
      {
        onRequest: () => {
          toast({
            title: "Please wait...",
          });
        },
        onSuccess: () => {
          form.reset();
        },

        onError: (ctx) => {
          toast({
            title: ctx.error.message,
          });
        },
      }
    );
  }

  return (
    <>
      <Card className="max-w-md mx-auto my-28  ">
        <CardHeader>
          <CardTitle className="font-bold text-3xl">Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="foshatia@gmail.com" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex  items-center justify-between max-w-2xl">
                      <FormLabel>Password</FormLabel>

                      <span>
                        <Link
                          className="text-xs font-thin"
                          href="/forgot-password"
                        >
                          {" "}
                          forget password
                        </Link>
                      </span>
                    </div>

                    <FormControl>
                      <Input type="password" placeholder="*****" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" type="submit">
                Log in
              </Button>
            </form>
          </Form>
          <div className="mt-2">
            <Button43 />
          </div>
        </CardContent>
        <CardFooter>
          <p>
            Don&apos;t have an account yet?
            <Link className="font-bold ml-2" href="sign-up">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </>
  );
}
