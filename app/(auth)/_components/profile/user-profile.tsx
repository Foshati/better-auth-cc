import { Fingerprint, User, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/(auth)/_components/ui/auth-avatar";
import Link from "next/link";
import SignoutButton from "../button/signout-button";
import { currentUser } from "@/app/(auth)/_lib/helper/currentUser";
import { Button } from "@/components/ui";

export const UserProfile = async () => {
  const user = await currentUser();

  // Function to get initials from name
  const getInitials = (name?: string) => {
    if (!name) return "UN";
    const names = name.split(" ");
    return names
      .map((n) => n[0].toUpperCase())
      .slice(0, 2)
      .join("");
  };
  return (
    <div>
      {!user ? (
        <div className="flex gap-2 justify-center">
          <Link href="/sign-in" className="text-lg">
            <Fingerprint />
          </Link>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full p-0 focus:ring-2">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={user?.image || undefined}
                  alt={user?.name || "User Profile"}
                />
                <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex items-center space-x-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={user?.image || undefined}
                    alt={user?.name || "User Profile"}
                  />
                  <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/dashboard" >
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
            </Link>

            <Link href="/dashboard/settings" >
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>settings</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
