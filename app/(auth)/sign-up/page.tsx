"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
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
import { formSchema } from "@/lib/auth-schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import InputSchema from "@/components/inputSchema";

export default function Signin() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, email, password } = values;
    const { data:_data, error:_error } = await authClient.signUp.email(
      { name, email, password, callbackURL: "/sign-in" },
      {
        onRequest: () => {
          toast({
            title: "Please wait...",
          });
        },
        onSuccess: () => {
          redirect("/sign-in");
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

              <Button className="w-full" type="submit">
                Sign up
              </Button>
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
