import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/app/(auth)/_components/input/auth-input";
import { Toggle } from "@/components/ui/toggle";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  InfoIcon,
  MenuIcon,
  SearchIcon,
} from "lucide-react";
import { UserProfile } from "@/app/(auth)/_components/profile/user-profile";
import { ModeToggle } from "../ModeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <InfoIcon className="h-6 w-6" />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link
            href="#"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            prefetch={false}
          >
            Home
          </Link>
          <Link
            href="#"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            prefetch={false}
          >
            About
          </Link>
          <Link
            href="#"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            prefetch={false}
          >
            Services
          </Link>
          <Link
            href="#"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            prefetch={false}
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4">
      
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <SearchIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="sr-only">Search</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[300px] p-4">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 w-full"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div >
<ModeToggle/>
          </div>

          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger>
                <MenuIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader className="flex flex-col justify-center items-center gap-8 pt-6">
                  <SheetTitle>Name site</SheetTitle>
                  <SheetDescription>
                    <Link
                      href="#"
                      className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      prefetch={false}
                    >
                      Home
                    </Link>
                  </SheetDescription>
                  <SheetDescription>
                    <Link
                      href="#"
                      className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      prefetch={false}
                    >
                      About
                    </Link>
                  </SheetDescription>
                  <SheetDescription>
                    <Link
                      href="#"
                      className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      prefetch={false}
                    >
                      Services
                    </Link>
                  </SheetDescription>
                  <SheetDescription>
                    <Link
                      href="#"
                      className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      prefetch={false}
                    >
                      Contact
                    </Link>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>

          </div>
          
          <UserProfile />

        </div>
      </div>
    </header>
  );
}
