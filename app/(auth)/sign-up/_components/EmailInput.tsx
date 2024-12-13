import React, { useState, useEffect, useCallback } from "react";
import { Control, Controller } from "react-hook-form";
import { z } from "zod";
import { signUpSchema } from "@/lib/auth-schema";
import { Input } from "@/components/ui/input";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Check, X } from "lucide-react";

type EmailInputProps = {
  control: Control<z.infer<typeof signUpSchema>>;
};

export default function EmailInput({ control }: EmailInputProps) {
  const [emailStatus, setEmailStatus] = useState({
    status: 'idle' as 'idle' | 'checking' | 'unique' | 'duplicate',
    message: '',
  });

  const validateEmail = useCallback(async (email: string) => {
    if (!email || email.trim() === '') {
      setEmailStatus({ status: 'idle', message: '' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailStatus({ status: 'idle', message: '' });
      return;
    }

    setEmailStatus({ status: 'checking', message: '' });

    try {
      const response = await fetch(`/api/validate-email?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      setEmailStatus({
        status: data.isUnique ? 'unique' : 'duplicate',
        message: data.isUnique ? 'Email is available' : 'Email is already registered'
      });
    } catch (error) {
      setEmailStatus({
        status: 'idle',
        message: 'Error checking email'
      });
    }
  }, []);

  return (
    <Controller
      control={control}
      name="email"
      render={({ field, fieldState: { error } }) => {
        useEffect(() => {
          validateEmail(field.value);
        }, [field.value, validateEmail]);

        return (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl className="relative">
              <div className="flex items-center">
                <Input 
                  placeholder="foshatia@gmail.com" 
                  {...field} 
                  className={`pr-10 ${
                    emailStatus.status === 'duplicate' 
                    ? 'border-red-500' 
                    : emailStatus.status === 'unique' 
                    ? 'border-green-500' 
                    : ''
                  }`}
                />
                {emailStatus.status === 'unique' && (
                  <Check 
                    className="absolute right-2 text-green-500" 
                    size={20} 
                  />
                )}
                {emailStatus.status === 'duplicate' && (
                  <X 
                    className="absolute right-2 text-red-500" 
                    size={20} 
                  />
                )}
              </div>
            </FormControl>
            {emailStatus.status === 'duplicate' && (
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