import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default async function EmailVerifiedPage() {
  return (
    <div className="flex flex-col items-center justify-center grow p-4 text-center">
      <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" />
      <h1 className="mb-4 text-3xl font-bold text-green-600">
        Email Verified Successfully!
      </h1>
      <p className="mb-6 text-gray-600 max-w-md">
        Your email has been successfully verified. You can now access all
        features of your account.
      </p>
      <Link
        href="/"
        className={buttonVariants({
          variant: "default",
          size: "lg",
        })}
      >
        Go to Home Page
      </Link>
    </div>
  );
}
