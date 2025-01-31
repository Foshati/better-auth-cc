import { getServerSession } from "../../_lib/helper/auth-utility";

export default async function ModeratorDashboardPage() {
  const session = await getServerSession();
  return (
    <div className="mt-10 text-center">
      <h1 className="text-2xl font-bold underline">
        Welcome to the User dashboard
      </h1>
      <ul>
        <li>Name: {session?.user.name}</li>
        <li>username: {session?.user.username}</li>
        <li>Email: {session?.user.email}</li>
        <li>role: {session?.user.role}</li>
      </ul>
    </div>
  );
}
