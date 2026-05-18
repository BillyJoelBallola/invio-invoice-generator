import { currentUser } from "@/actions/user.action";
import Authentication from "@/components/Authentication";
import Sidebar from "@/components/Sidebar";

async function AppWrapper({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  if (!user) {
    return (
      <div className="w-screen h-screen grid place-items-center">
        <Authentication />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

export default AppWrapper;
