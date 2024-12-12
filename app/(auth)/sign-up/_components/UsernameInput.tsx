import React, { useState, useEffect } from "react";
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

type UsernameInputProps = {
  control: Control<z.infer<typeof signUpSchema>>;
};

export default function UsernameInput({ control }: UsernameInputProps) {
  const [usernameStatus, setUsernameStatus] = useState<{
    status: 'idle' | 'checking' | 'unique' | 'duplicate';
    message: string;
  }>({
    status: 'idle',
    message: '',
  });

  const validateUsername = async (username: string) => {
    if (!username || username.trim() === "") {
      setUsernameStatus({ status: 'idle', message: '' });
      return;
    }

    const usernameRegex = /^@[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      setUsernameStatus({ status: 'idle', message: '' });
      return;
    }

    setUsernameStatus({ status: 'checking', message: '' });

    try {
      const response = await fetch(`/api/validate-username?username=${encodeURIComponent(username)}`);
      const data = await response.json();

      if (data.isUnique) {
        setUsernameStatus({ 
          status: 'unique', 
          message: 'Username is available' 
        });
      } else {
        setUsernameStatus({ 
          status: 'duplicate', 
          message: 'Username is already taken' 
        });
      }
    } catch (error) {
      setUsernameStatus({ 
        status: 'idle', 
        message: 'Error checking username' 
      });
    }
  };

  return (
    <Controller
      control={control}
      name="username"
      render={({ field, fieldState: { error } }) => {
        useEffect(() => {
          validateUsername(field.value);
        }, [field.value]);

        return (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl className="relative">
              <div className="flex items-center">
                <Input 
                  placeholder="@Foshati" 
                  {...field} 
                  className={`pr-10 ${
                    usernameStatus.status === 'duplicate' 
                    ? 'border-red-500' 
                    : usernameStatus.status === 'unique' 
                    ? 'border-green-500' 
                    : ''
                  }`}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value.startsWith("@") ? value : `@${value}`);
                  }}
                />
                {usernameStatus.status === 'unique' && (
                  <Check 
                    className="absolute right-2 text-green-500" 
                    size={20} 
                  />
                )}
                {usernameStatus.status === 'duplicate' && (
                  <X 
                    className="absolute right-2 text-red-500" 
                    size={20} 
                  />
                )}
              </div>
            </FormControl>
            {usernameStatus.status === 'duplicate' && (
              <FormMessage className="text-red-500">
                {usernameStatus.message}
              </FormMessage>
            )}
            {error && <FormMessage>{error.message}</FormMessage>}
          </FormItem>
        );
      }}
    />
  );
}