"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/app/(auth)/_lib/auth-client";
import { LogOut } from "lucide-react";
import SubmitButton from "@/app/(auth)/_components/button/submit-button";

export default function SignoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleSignOut = async () => {
    try {
      setPending(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/sign-in");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setPending(false);
    }
  };

  return (
    <SubmitButton pending={pending} onClick={handleSignOut}  className="w-full" variant="ghost">
      <LogOut  />
      Log Out
    </SubmitButton>
  );
}
