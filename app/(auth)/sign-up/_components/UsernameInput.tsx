import React, { useState, useEffect } from "react";
import { Control, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { signUpSchema } from "@/app/(auth)/_lib/auth-schema";
import { Input } from "@/app/(auth)/_components/input/auth-input";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Check, X, RefreshCw, LoaderCircle } from "lucide-react";

type UsernameInputProps = {
  control: Control<z.infer<typeof signUpSchema>>;
};

export default function UsernameInput({ control }: UsernameInputProps) {
  const [usernameStatus, setUsernameStatus] = useState<{
    status: "idle" | "checking" | "unique" | "duplicate";
    message: string;
  }>({
    status: "idle",
    message: "",
  });

  const [suggestedUsernames, setSuggestedUsernames] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Watch the username field value
  const usernameValue = useWatch({ control, name: "username" });

  // Watch the name field value
  const name = useWatch({ control, name: "name" });

  const validateUsername = async (username: string) => {
    if (!username || username.trim() === "") {
      setUsernameStatus({ status: "idle", message: "" });
      return;
    }

    setUsernameStatus({ status: "checking", message: "" });

    try {
      const response = await fetch(
        `/api/auth/validate-username?username=${encodeURIComponent(username)}`
      );
      const data = await response.json();

      if (data.isUnique) {
        setUsernameStatus({
          status: "unique",
          message: "Username is available",
        });
      } else {
        setUsernameStatus({
          status: "duplicate",
          message: "Username is already taken",
        });
      }
    } catch (error) {
      setUsernameStatus({
        status: "idle",
        message: "Error checking username",
      });
    }
  };

  const generateUsernames = async (baseName: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch(
        `/api/auth/generate-usernames?baseName=${encodeURIComponent(baseName)}`
      );
      const data = await response.json();

      setSuggestedUsernames(data.usernames || []);
    } catch (error) {
      console.error("Error generating usernames:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Validate username whenever usernameValue changes
  useEffect(() => {
    validateUsername(usernameValue);
  }, [usernameValue]);

  return (
    <Controller
      control={control}
      name="username"
      render={({ field }) => {
        const hasValue = field.value && field.value.trim() !== "";
        const error = control._formState.errors.username;
        const isFullyValid = usernameStatus.status === "unique" && !error;

        return (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl className="relative">
              <div className="flex items-center">
                <Input
                  placeholder="@username"
                  {...field}
                  variant={!hasValue ? "default" : error ? "error" : "success"}
                  className={`pr-10 
                    ${isFullyValid ? "border-green-500" : ""}
                    ${
                      usernameStatus.status === "duplicate"
                        ? "border-red-500"
                        : ""
                    }
                    ${
                      usernameStatus.status === "checking"
                        ? "border-yellow-500"
                        : ""
                    }
                  `}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value.startsWith("@") ? value : `@${value}`);
                  }}
                />
                <button
                  type="button"
                  className="absolute right-11 text-gray-500 hover:text-black disabled:text-gray-300"
                  onClick={() => generateUsernames(name || "user")}
                  disabled={!name || isGenerating}
                >
                  <RefreshCw
                    size={16}
                    className={isGenerating ? "animate-spin" : ""}
                  />
                </button>
                {isFullyValid && (
                  <Check
                    className="absolute right-2 text-green-500"
                    size={20}
                  />
                )}
                {usernameStatus.status === "duplicate" && (
                  <X className="absolute right-2 text-red-500" size={20} />
                )}
                {usernameStatus.status === "checking" && (
                  <LoaderCircle
                    className="absolute right-2 text-yellow-500 animate-spin"
                    size={20}
                  />
                )}
              </div>
            </FormControl>
            {usernameStatus.status === "duplicate" && (
              <FormMessage className="text-red-500">
                {usernameStatus.message}
              </FormMessage>
            )}
            {error && <FormMessage>{error.message}</FormMessage>}
            {suggestedUsernames.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {suggestedUsernames.map((username) => (
                  <button
                    key={username}
                    type="button"
                    className="px-3 py-1 border rounded text-sm bg-gray-100 hover:bg-gray-200"
                    onClick={() => field.onChange(`@${username}`)}
                  >
                    @{username}
                  </button>
                ))}
              </div>
            )}
          </FormItem>
        );
      }}
    />
  );
}