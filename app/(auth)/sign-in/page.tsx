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
import { Input } from "@/components/ui/input";
import SocialButtons from "@/app/(auth)/_components/button/socials-buttonts";
import { signInSchema } from "@/lib/auth-schema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ErrorContext } from "@better-fetch/fetch";
import SubmitButton from "@/components/submitButton";
import InputHide from "../_components/input/hide-input";

export default function SignIn() {
  const router = useRouter();
  const { toast } = useToast();
  const [pendingCredentials, setPendingCredentials] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleCredentialsSignIn = async (
    values: z.infer<typeof signInSchema>
  ) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onRequest: () => {
          setPendingCredentials(true);
        },
        onSuccess: async () => {
          router.push("/");
          router.refresh();
        },
        onError: (ctx: ErrorContext) => {
          console.log(ctx);
          toast({
            title: "Something went wrong",
            description: ctx.error.message ?? "Something went wrong.",
            variant: "destructive",
          });
        },
      }
    );
    setPendingCredentials(false);
  };

  const isFormFilled = form.watch("email").trim() !== "" && form.watch("password").trim() !== "";

  return (
    <>
      <Card className="w-full max-w-xs sm:max-w-sm lg:max-w-lg mx-auto my-28">
        <CardHeader>
          <CardTitle className="font-bold text-3xl">Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCredentialsSignIn)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => {
                  const error = form.formState.errors.email;
                  return (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          variant={error ? "error" : form.formState.touchedFields.email ? "success" : "default"}
                          placeholder="foshatia@gmail.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  const error = form.formState.errors.password;
                  return (
                    <FormItem>
                      <div className="flex items-center justify-between max-w-2xl">
                        <FormLabel>Password</FormLabel>
                        <span>
                          <Link
                            className="text-[10px] font-thin text-slate-900 hover:text-yellow-500"
                            href="/forgot-password"
                          >
                            Forgot password
                          </Link>
                        </span>
                      </div>
                      <FormControl>
                        <InputHide
                          field={field}
                          variant={error ? "error" : form.formState.touchedFields.password ? "success" : "default"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <SubmitButton
                className="w-full"
                pending={pendingCredentials}
                disabled={!isFormFilled}
              >
                Sign in
              </SubmitButton>
            </form>
          </Form>

          <div className="flex items-center justify-center my-6">
            <hr className="border-t-2 border-gray-300 flex-1" />
            <span className="mx-4 text-gray-600 text-[10px]">or</span>
            <hr className="border-t-2 border-gray-300 flex-1" />
          </div>

          <div className="mt-2">
            <SocialButtons />
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs font-medium text-slate-700">
            Don&apos;t have an account yet?
          </p>
          <Link className="text-sm font-bold  ml-2" href="sign-up">
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
