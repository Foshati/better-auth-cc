import { Controller } from "react-hook-form";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ImageUp } from "lucide-react";
import React from "react";

const AvatarUploader = ({ control }: { control: any }) => {
  const [imageError, setImageError] = React.useState<string | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: any) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileType = file.type.split("/")[1];
      const fileSize = file.size / 1024 / 1024; // in MB

      // Allowed file types (png, jpg, webp, gif)
      const allowedTypes = ["png", "jpeg", "webp", "gif"];

      if (!allowedTypes.includes(fileType)) {
        setImageError("Only PNG, JPG, WebP, or GIF formats are allowed.");
        return;
      }

      // Check the file size (limit to 5MB for example)
      if (fileSize > 5) {
        setImageError("File size should not exceed 5MB.");
        return;
      }

      setImageError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result); // Set the avatar URL to form state
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <Controller
        name="avatar"
        control={control}
        render={({ field }) => (
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, field.onChange)}
              className="hidden"
              id="avatarInput"
            />
            <label htmlFor="avatarInput" className="cursor-pointer">
              <Avatar className="relative">
                <AvatarImage src={field.value || ""} />
                <AvatarFallback>?</AvatarFallback>

                {/* Hover icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <ImageUp className="text-white text-2xl" />
                </div>
              </Avatar>
            </label>
            {imageError && (
              <p className="text-red-500 text-xs mt-2">{imageError}</p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default AvatarUploader;
