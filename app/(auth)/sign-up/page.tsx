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

import { authClient } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";
import InputSchema from "@/components/inputSchema";
import { signUpSchema } from "@/lib/auth-schema";
import InputHide from "@/components/inputHide";
import SubmitButton from "@/components/submitButton";

export default function SignUp() {
  const [pending, setPending] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: undefined,
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Avatar must be less than 5MB.",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPEG, PNG, GIF, or WebP image.",
          variant: "destructive",
        });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Set file in form
      form.setValue("avatar", file);
    }
  };

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    setPending(true);

    try {
      // If avatar is present, upload it first
      let avatarUrl = null;
      if (values.avatar) {
        const formData = new FormData();
        formData.append("file", values.avatar);

        // Assuming you have an upload endpoint that returns the URL
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Avatar upload failed");
        }

        const uploadResult = await uploadResponse.json();
        avatarUrl = uploadResult.url;
      }

      // Sign up with optional avatar URL
      await authClient.signUp.email(
        {
          email: values.email,
          password: values.password,
          name: values.name,
          image: avatarUrl, // Optional avatar URL
        },
        {
          onSuccess: () => {
            toast({
              title: "Account created",
              description:
                "Your account has been created. Check your email for a verification link.",
            });
          },
          onError: (ctx) => {
            console.error("error", ctx);
            toast({
              title: "Something went wrong",
              description: ctx.error.message ?? "Something went wrong.",
            });
          },
        }
      );
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Failed",
        description: "Unable to complete signup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPending(false);
    }
  };

  const isFormFilled =
    form.watch("email").trim() !== "" &&
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
              {/* Avatar Upload */}
              <FormItem className="flex flex-col items-center space-y-4">
                <FormLabel>Profile Picture (Optional)</FormLabel>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      src={avatarPreview || undefined}
                      alt="Profile Picture"
                      className="object-cover"
                    />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>

                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleAvatarChange}
                    className="flex-grow"
                  />
                </div>
              </FormItem>

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
