import { UserProfile } from "@/app/(auth)/_components/profile/user-profile";
import { Button } from "@/components/ui";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Home } from "lucide-react";
import Link from "next/link";

export default function NavbarDashboard() {
  return (
    <div className="flex border-b p-4 justify-between items-center">
      <div>
        <SidebarTrigger />
      </div>
      <div className="flex justify-center items-center gap-4">
        <Link href="/"> <Button variant="link">Home</Button></Link>
        <Bell className="size-5"/>
        <UserProfile />
      </div>
    </div>
  );
}
