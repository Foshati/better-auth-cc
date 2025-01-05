"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import SubmitButton from '@/app/(auth)/_components/button/submit-button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { authClient } from '@/app/(auth)/_lib/auth-client';
import { signUpSchema } from '@/app/(auth)/_lib/auth-schema';

import SocialButtons from '../_components/button/socials-buttonts';
import ConfirmPasswordInput from './_components/ConfirmPasswordInput';
import EmailInput from './_components/EmailInput';
import NameInput from './_components/NameInput';
import PasswordInput from './_components/PasswordInput';
import UsernameInput from './_components/UsernameInput';

export default function SignUp() {
  const [pending, setPending] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      const signupData = {
        email: values.email,
        password: values.password,
        name: values.name,
        username: values.username,
      };

      await authClient.signUp.email(signupData, {
        onRequest: () => {
          setPending(true);
        },
        onSuccess: () => {
          setShowResendButton(true);
          toast({
            title: "Account Created",
            description: "Check your email for a verification link.",
          });
        },
        onError: (ctx) => {
          let errorField = "";
          const errorMessage = ctx.error.message ?? "Something went wrong.";

          switch (ctx.error.code) {
            case "USERNAME_TAKEN":
              errorField = "Username";
              form.setError("username", {
                type: "manual",
                message: "Username is already taken",
              });
              break;
            case "USERNAME_INVALID":
              errorField = "Username";
              form.setError("username", {
                type: "manual",
                message: "Username is invalid",
              });
              break;
            case "EMAIL_TAKEN":
              errorField = "Email";
              form.setError("email", {
                type: "manual",
                message: "Email is already registered",
              });
              break;
            case "EMAIL_INVALID":
              errorField = "Email";
              form.setError("email", {
                type: "manual",
                message: "Invalid email address",
              });
              break;
            case "PASSWORD_WEAK":
              errorField = "Password";
              form.setError("password", {
                type: "manual",
                message: "Password is too weak",
              });
              break;
            case "NAME_INVALID":
              errorField = "Name";
              form.setError("name", {
                type: "manual",
                message: "Invalid name",
              });
              break;
            default:
              errorField = "Account";
          }

          toast({
            title: `${errorField} Error`,
            description: errorMessage,
            variant: "destructive",
          });
        },
      });
    } catch (error: unknown) { // استفاده از unknown به جای any
      console.error("Signup failed", error);

      const errorMessage = error instanceof Error ? error.message : "Unable to create account. Please try again.";

      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setPending(false);
    }
  };

  const isFormFilled =
    form.watch("email").trim() !== "" &&
    form.watch("username").trim() !== "" &&
    form.watch("password").trim() !== "" &&
    form.watch("name").trim() !== "";

  return (
    <Card className="w-full max-w-xs sm:max-w-sm lg:max-w-lg mx-auto my-28">
      <CardHeader>
        <CardTitle className="font-bold text-3xl">Sign up</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <NameInput control={form.control} />
            <UsernameInput control={form.control} />
            <EmailInput control={form.control} />
            <PasswordInput control={form.control} />
            <ConfirmPasswordInput control={form.control} />

            <SubmitButton
              className="w-full"
              pending={pending}
              disabled={!isFormFilled || !form.formState.isValid}
            >
              Sign up
            </SubmitButton>
          </form>
        </Form>
        {showResendButton && form.watch("email").trim() && (
          <>
            <div className="flex items-center justify-center my-6">
              <hr className="border-t-2 border-gray-300 flex-1" />
              <span className="mx-4 text-gray-600 text-[10px]">or</span>
              <hr className="border-t-2 border-gray-300 flex-1" />
            </div>

            <div className="flex flex-col mt-4">
              <SocialButtons />
            </div>
          </>
        )}
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
  );
}