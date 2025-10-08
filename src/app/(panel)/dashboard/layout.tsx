import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/app/(panel)/dashboard/_components/sidebar/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { NotificationList } from "./_components/notification";
import { UtilityActionDashboard } from "@/app/(panel)/dashboard/_components/utility-action-dashboard";
import { getWorkspaces } from "./_data-access/get-workspace";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect('/')
  }
  const Workspaces = await getWorkspaces();
  return (
    <SidebarProvider>
      <AppSidebar Workspaces={Workspaces} userData={session} />
      <main className="relative w-full px-2 pt-4">
        <SidebarTrigger className="fixed" />
        <NotificationList />
        <UtilityActionDashboard />
        {children}
      </main>
    </SidebarProvider>
  )
}