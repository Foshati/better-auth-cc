import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation"; // اضافه کردن import برای redirect

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div className="border-b px-4  ">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
        <Link href="/" className="font-bold text-lg">
          BetterAuth
        </Link>

        <div>
          <ul className=" flex space-x-6 ">
            <li>
              <Link href="/"> Home</Link>
            </li>
            <li>
              <Link href="blog/"> Blog</Link>
            </li>
            <li>
              <Link href="about/"> About</Link>
            </li>
            <li>
              <Link href="contact/"> contact us</Link>
            </li>
          </ul>
        </div>

        <div>
          {session ? (
            <form
              action={async () => {
                "use server";
                await auth.api.signOut({
                  headers: await headers(),
                });
                redirect("/");
              }}
            >
              <div className="space-x-2">
                <Button type="submit">Sign Out</Button>
                <Link className={buttonVariants()} href="/dashboard">
                  Dashboard
                </Link>
              </div>
            </form>
          ) : (
            <Link href="sign-in" className={buttonVariants()}>
              sign in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
