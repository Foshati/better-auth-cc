import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/");
  }

  const user = session?.user;
  return <div>
    
    <ul>
      <li> name : {user.name}</li>
      <li> email : {user.email}</li>
    </ul>
  </div>;
}
