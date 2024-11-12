import Link from "next/link";
import { buttonVariants } from "../ui/button";

export default function Navbar() {
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
          <Link href="sign-in" className={buttonVariants()}>
            sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
