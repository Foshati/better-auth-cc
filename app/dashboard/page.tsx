import { currentUser } from "@/lib/helper/currentUser";


export default async function DashboardPage() {
const user = await currentUser();
  return (
    <div className='mt-10 text-center'>
      <h1 className='text-2xl font-bold underline'>Welcome to the dashboard</h1>
      <ul>
        <li>Name: {user?.name}</li>
        <li>Email: {user?.email}</li>
      </ul>
    </div>
  );
}
