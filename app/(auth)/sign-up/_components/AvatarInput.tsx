"use client";

import React, { useState, useRef } from "react";
import { Control, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ImageUp, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/app/(auth)/_components/ui/auth-avatar";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { signUpSchema } from "@/app/(auth)/_lib/auth-schema";
import { z } from "zod";

interface AvatarInputProps {
  control: Control<z.infer<typeof signUpSchema>>;
}

const AvatarInput: React.FC<AvatarInputProps> = ({ control }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file format and size
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        setError("Only .jpg, .jpeg, and .png files are allowed");
        setPreviewUrl(null);
        setFileName(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        setPreviewUrl(null);
        setFileName(null);
        return;
      }

      setError(null); // Clear error if valid
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <FormField
      control={control}
      name="image"
      render={({ field }) => (
        <FormItem className="flex flex-col items-center justify-center space-y-2">
          <FormControl>
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  handleFileChange(e);
                  const file = e.target.files?.[0];
                  field.onChange(file);
                }}
                className="hidden"
                accept="image/*"
                aria-label="Upload image file"
              />
              <div className="relative  ">
                <Avatar
                  className={`cursor-pointer w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-26 lg:h-26 ${
                    previewUrl
                      ? error
                        ? "border-2 border-red-600"
                        : "border-2 border-green-600 shadow-lg"
                      : error
                      ? "border-2 border-red-600 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold"
                      : "border-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold"
                  } relative group`}
                  onClick={handleThumbnailClick}
                >
                  {previewUrl ? (
                    <AvatarImage
                      src={previewUrl}
                      alt="Preview of uploaded image"
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback />
                  )}

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ImageUp />
                  </div>
                </Avatar>

                {previewUrl && (
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove();
                      field.onChange(undefined);
                    }}
                    size="icon"
                    variant="destructive"
                    className="absolute -right-2 -top-2 size-6 rounded-full"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
              {/*    {fileName && (
                <p className="mt-2 text-xs text-center text-muted-foreground">
                  {fileName}
                </p>
              )} */}
              {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AvatarInput;
