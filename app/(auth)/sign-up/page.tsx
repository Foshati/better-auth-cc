"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { authClient } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";
import { signUpSchema } from "@/lib/auth-schema";
import InputHide from "@/components/inputHide";
import SubmitButton from "@/components/submitButton";
import InputSchema from "@/components/inputSchema";

export default function SignUp() {
  const [pending, setPending] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: null,
    },
    mode: "onChange", // Validate on change
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // More comprehensive file validation
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File Size Exceeded",
          description: "Avatar must be less than 5MB.",
          variant: "destructive",
        });
        event.target.value = ''; // Clear the file input
        return;
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Only JPEG, PNG, GIF, and WebP images are allowed.",
          variant: "destructive",
        });
        event.target.value = ''; // Clear the file input
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      form.setValue("avatar", file, { 
        shouldValidate: true, 
        shouldDirty: true 
      });
    }
  };

  const handleAvatarRemove = () => {
    setAvatarPreview(null);
    form.setValue("avatar", null, { 
      shouldValidate: true, 
      shouldDirty: true 
    });
  };

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    setPending(true);

    try {
      let avatarUrl = null;
      if (values.avatar) {
        const formData = new FormData();
        formData.append("file", values.avatar);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorDetails = await uploadResponse.json();
          throw new Error(errorDetails.message || "Avatar upload failed");
        }

        const uploadResult = await uploadResponse.json();
        avatarUrl = uploadResult.url;
      }

      await authClient.signUp.email(
        {
          email: values.email,
          username: values.username,
          password: values.password,
          name: values.name,
          image: avatarUrl,
        },
        {
          onSuccess: () => {
            toast({
              title: "Account Created",
              description: "Your account has been created. Check your email for verification.",
            });
            // Optional: Reset form or redirect
            form.reset();
          },
          onError: (errorContext: { error: unknown }) => {
            toast({
              title: "Signup Failed",
              description: (errorContext.error as Error).message || "An unknown error occurred.",
              variant: "destructive",
            });
          },
        }
      );
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: (error as Error).message || "Unable to complete signup.",
        variant: "destructive",
      });
    } finally {
      setPending(false);
    }
  };

  // More dynamic form validation check
  const isFormValid = Object.values(form.watch()).every(
    (value) => value !== null && value !== ""
  ) && Object.keys(form.formState.errors).length === 0;

  return (
    <Card className="w-full max-w-xs sm:max-w-sm lg:max-w-lg mx-auto my-28">
      <CardHeader>
        <CardTitle className="font-bold text-3xl">Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Upload Section */}
            <FormItem className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24 relative">
                <AvatarImage
                  src={avatarPreview || undefined}
                  alt="Profile Picture"
                  className="object-cover"
                />
                <AvatarFallback>Profile</AvatarFallback>
                {avatarPreview && (
                  <Button
                    type="button"
                    onClick={handleAvatarRemove}
                    className="absolute top-0 right-0 bg-red-500 text-white w-6 h-6 p-0 rounded-full hover:bg-red-600"
                    aria-label="Remove avatar"
                  >
                    ✕
                  </Button>
                )}
              </Avatar>
              {!avatarPreview && (
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleAvatarChange}
                  aria-label="Upload profile picture"
                  className="mt-4 w-full"
                />
              )}
            </FormItem>

            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <InputSchema {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <InputHide field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <SubmitButton
              type="submit"
              className="w-full mt-6"
              disabled={!isFormValid || pending}
              pending={pending}
            >
              Create Account
            </SubmitButton>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-600 hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}