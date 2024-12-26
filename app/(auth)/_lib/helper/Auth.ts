import { auth } from "@/app/(auth)/_lib/auth";
import { headers } from "next/headers";
import { cache } from "react";
import { redirectToSignIn } from "./redirectToSignIn";
import { redirect } from "next/navigation";

export const Auth = cache(async () => {
  "use server";

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user ?? null;

  return {
    userId: user?.id ?? null,

    protect: async ({
      role,
      redirectTo,
    }: { role?: string; redirectTo?: string } = {}) => {
      if (!user) {
        redirectToSignIn(redirectTo);
      }

      if (role && user?.role !== role) {
        redirect("/404");
      }

      return session;
    },

    getToken: async () => session?.session?.token ?? null,

    redirectToSignIn,

    user,
    isAuthenticated: !!user,
    role: user?.role ?? null,
  };
});
