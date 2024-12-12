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
import { signUpSchema } from "@/lib/auth-schema";
import { useState } from "react";
import SubmitButton from "@/components/submitButton";
import InputSchema from "../_components/input/hard-input";
import InputHide from "../_components/input/hide-input";

export default function SignUp() {
  const [pending, setPending] = useState(false);
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
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    // First, validate the entire form
    const validationResult = signUpSchema.safeParse(values);

    if (!validationResult.success) {
      // If validation fails, set form errors
      validationResult.error.errors.forEach((error) => {
        form.setError(error.path[0] as keyof z.infer<typeof signUpSchema>, {
          type: "manual",
          message: error.message,
        });
      });
      return;
    }

    try {
      await authClient.signUp.email(
        {
          email: values.email,
          password: values.password,
          name: values.name,
          username: values.username,
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
            let errorField = "";
            let errorMessage = ctx.error.message ?? "Something went wrong.";

            // Specific error handling for different fields
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
                // For unexpected errors
                errorField = "Account";
            }

            // Toast with more informative message
            toast({
              title: `${errorField} Error`,
              description: errorMessage,
              variant: "destructive",
            });
          },
        }
      );
    } catch (error: any) {
      console.error("Signup failed", error);

      // Generic error handling
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
    form.watch("name").trim() !== "" &&
    form.watch("confirmPassword").trim() !== "";

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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <Input
                      placeholder="@Foshati"
                      {...field}
                      // Optional: Automatically add @ if not present
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value.startsWith("@") ? value : `@${value}`
                        );
                      }}
                    />
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
                      <FormLabel>Confirm Password</FormLabel>
                    </div>
                    <FormControl>
                      <InputHide field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SubmitButton
                className="w-full"
                pending={pending}
                disabled={!isFormFilled}
              >
                Sign up
              </SubmitButton>
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
