import { useState, useRef, ChangeEvent } from 'react';

export function useImageUpload() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file format and size
      if (!["image/jpeg", "image/png", "image/jpg"].includes(selectedFile.type)) {
        setError("Only .jpg, .jpeg, and .png files are allowed");
        setPreviewUrl(null);
        setFile(null);
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        setPreviewUrl(null);
        setFile(null);
        return;
      }

      setError(null); // Clear any previous errors
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    previewUrl,
    file,
    error,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
    fileName: file?.name,
  };
}