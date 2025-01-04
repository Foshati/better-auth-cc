import { Check, LoaderCircle, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Control, Controller, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { Input } from '@/app/(auth)/_components/input/auth-input';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { signUpSchema } from '@/app/(auth)/_lib/auth-schema';

type EmailInputProps = {
  control: Control<z.infer<typeof signUpSchema>>;
};

export default function EmailInput({ control }: EmailInputProps) {
  const [emailStatus, setEmailStatus] = useState<{
    status: "idle" | "checking" | "unique" | "duplicate";
    message: string;
  }>({
    status: "idle",
    message: "",
  });

  const validateEmail = useCallback(async (email: string) => {
    if (!email || email.trim() === "") {
      setEmailStatus({ status: "idle", message: "" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailStatus({ status: "idle", message: "" });
      return;
    }

    setEmailStatus({ status: "checking", message: "" });

    try {
      const response = await fetch(`/api/auth/validate-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      setEmailStatus({
        status: data.isUnique ? "unique" : "duplicate",
        message: data.isUnique ? "Email is available" : "Email is already registered"
      });
    } catch (error) {
      setEmailStatus({
        status: "idle",
        message: "Error checking email"
      });
    }
  }, []);

  const emailValue = useWatch({
    control,
    name: "email",
  });

  useEffect(() => {
    if (emailValue) {
      validateEmail(emailValue);
    }
  }, [emailValue, validateEmail]);

  return (
    <Controller
      control={control}
      name="email"
      render={({ field }) => {
        const hasValue = field.value && field.value.trim() !== "";
        const error = control._formState.errors.email;
        const isFullyValid = emailStatus.status === "unique" && !error;

        return (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl className="relative">
              <div className="flex items-center">
                <Input
                  placeholder="example@gmail.com"
                  {...field}
                  variant={!hasValue ? "default" : error ? "error" : "success"}
                  className={`pr-10 
                    ${isFullyValid ? 'border-green-500' : ''}
                    ${emailStatus.status === "duplicate" ? 'border-red-500' : ''}
                    ${emailStatus.status === "checking" ? 'border-yellow-500' : ''}
                  `}
                />
                {isFullyValid && (
                  <Check
                    className="absolute right-2 text-green-500"
                    size={20}
                  />
                )}
                {emailStatus.status === "duplicate" && (
                  <X className="absolute right-2 text-red-500" size={20} />
                )}
                {emailStatus.status === "checking" && (
                  <LoaderCircle 
                    className="absolute right-2 text-yellow-500 animate-spin" 
                    size={20} 
                  />
                )}
              </div>
            </FormControl>
            {emailStatus.status === "duplicate" && (
              <FormMessage className="text-red-500">
                {emailStatus.message}
              </FormMessage>
            )}
            {error && <FormMessage>{error.message}</FormMessage>}
          </FormItem>
        );
      }}
    />
  );
}