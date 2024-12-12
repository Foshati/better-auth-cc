import React, { useState, useEffect } from "react";
import { Control, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { signUpSchema } from "@/lib/auth-schema";
import { Input } from "@/components/ui/input";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Check, X, RefreshCw } from "lucide-react";

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

  // Watch the name field value
  const name = useWatch({ control, name: "name" });

  const validateUsername = async (username: string) => {
    if (!username || username.trim() === "") {
      setUsernameStatus({ status: "idle", message: "" });
      return;
    }

    setUsernameStatus({ status: "checking", message: "" });

    try {
      const response = await fetch(`/api/validate-username?username=${encodeURIComponent(username)}`);
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
        `/api/generate-usernames?baseName=${encodeURIComponent(baseName)}`
      );
      const data = await response.json();

      setSuggestedUsernames(data.usernames || []);
    } catch (error) {
      console.error("Error generating usernames:", error);
    } finally {
      setIsGenerating(false);
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
                  placeholder="@username"
                  {...field}
                  className={`pr-10 ${
                    usernameStatus.status === "duplicate"
                      ? "border-red-500"
                      : usernameStatus.status === "unique"
                      ? "border-green-500"
                      : ""
                  }`}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(
                      value.startsWith("@") ? value : `@${value}`
                    );
                  }}
                />
                <button
                  type="button"
                  className="absolute right-8 text-gray-500 hover:text-gray-700 disabled:text-gray-300"
                  onClick={() => generateUsernames(name || "user")}
                  disabled={!name || isGenerating}
                >
                  <RefreshCw
                    size={20}
                    className={isGenerating ? "animate-spin" : ""}
                  />
                </button>
                {usernameStatus.status === "unique" && (
                  <Check
                    className="absolute right-2 text-green-500"
                    size={20}
                  />
                )}
                {usernameStatus.status === "duplicate" && (
                  <X className="absolute right-2 text-red-500" size={20} />
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
