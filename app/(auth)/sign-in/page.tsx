"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import SocialButtons from '@/app/(auth)/_components/button/socials-buttonts';
import SubmitButton from '@/app/(auth)/_components/button/submit-button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { authClient } from '@/app/(auth)/_lib/auth-client';

import { ErrorContext } from '@better-fetch/fetch';
import { zodResolver } from '@hookform/resolvers/zod';

import { EmailInput , PasswordInput } from './_components';
import { signInSchema } from '@/app/(auth)/_lib/auth-schema';

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
    mode: "onChange", // Validate on every change
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

  const isFormFilled =
    form.watch("email").trim() !== "" && form.watch("password").trim() !== "";

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
              <EmailInput control={form.control} />

              <PasswordInput control={form.control} />

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

          <SocialButtons />
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
