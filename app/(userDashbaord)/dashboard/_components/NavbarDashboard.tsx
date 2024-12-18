import { UserProfile } from "@/app/(auth)/_components/profile/user-profile";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function NavbarDashboard() {
  return (
    <div className="flex border-b p-4 justify-between items-center">
      <div>
        <SidebarTrigger />
      </div>
      <div>
        <UserProfile />
      </div>
    </div>
  );
}
