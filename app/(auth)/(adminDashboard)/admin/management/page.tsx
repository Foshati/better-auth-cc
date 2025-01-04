import UsersTable from "@/app/(auth)/_components/admin/users-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <main className="flex flex-col p-6">
      <div className="flex flex-col gap-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-2 mb-8">
          <p className="text-muted-foreground">
            Manage users and view system statistics
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersTable />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
