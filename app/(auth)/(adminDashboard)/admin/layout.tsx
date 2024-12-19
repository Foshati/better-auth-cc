import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { AppSidebar } from "./_components/app-sidebar";
import NavbarDashboard from "./_components/NavbarDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      
    <SidebarProvider>
    <div className="flex flex-1">
      <AppSidebar />

      <div className=" w-full ">
        <NavbarDashboard />
        <main>{children}</main>
      </div>
    </div>
  </SidebarProvider>
  );
}
