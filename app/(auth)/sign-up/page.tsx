"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import SubmitButton from '@/components/submitButton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { authClient } from '@/lib/auth-client';
import { signUpSchema } from '@/lib/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';

import SocialButtons from '../_components/button/socials-buttonts';
import ConfirmPasswordInput from './_components/ConfirmPasswordInput';
import EmailInput from './_components/EmailInput';
import NameInput from './_components/NameInput';
import PasswordInput from './_components/PasswordInput';
import UsernameInput from './_components/UsernameInput';
import AvatarInput from './_components/AvatarInput';

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
      image: undefined,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      // Create form data to handle file upload
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('name', values.name);
      formData.append('username', values.username);
      
      // Append image if it exists
      if (values.image) {
        formData.append('image', values.image);
      }

      // Convert FormData to an object for better-auth
      const signupData: Record<string, string | File | undefined> = {};
      formData.forEach((value, key) => {
        signupData[key] = value;
      });

      await authClient.signUp.email(signupData as any, {
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
          let errorMessage = ctx.error.message ?? "Something went wrong.";

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
    } catch (error: any) {
      console.error("Signup failed", error);

      toast({
        title: "Signup Failed",
        description:
          error.message ?? "Unable to create account. Please try again.",
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
          <AvatarInput control={form.control} />
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