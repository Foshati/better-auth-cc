"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface ResendEmailProps {
  email: string;
}

export default function ResendEmailButton({ email }: ResendEmailProps) {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleResendEmail = async () => {
    setIsSending(true);

    try {
      const response = await fetch(
        "/api/auth/email-and-password/resend-verification-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      // بررسی می‌کنیم که آیا پاسخ JSON است یا نه
      let data;
      try {
        data = await response.json(); // تلاش برای تبدیل به JSON
      } catch (e) {
        // اگر خطا داد، از متن استفاده می‌کنیم
        const text = await response.text();
        data = { message: text }; // ساخت یک شیء با پیغام خطا از متن
      }

      // بررسی وضعیت پاسخ
      if (!response.ok) {
        throw new Error(data.error || "Failed to resend verification email");
      }

      toast({
        title: "Success",
        description: data.message || "A verification email has been sent to your email address.",
        variant: "default", // تغییر نوع نمایش به "default"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend email.",
        variant: "destructive", // نمایش خطا
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Button variant="link" onClick={handleResendEmail} disabled={isSending}>
      {isSending ? "Sending..." : "Resend Verification Email"}
    </Button>
  );
}
