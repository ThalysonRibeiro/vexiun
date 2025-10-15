import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/app/(panel)/dashboard/_components/sidebar/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { NotificationList } from "./_components/notification";
import { UtilityActionDashboard } from "@/app/(panel)/dashboard/_components/utility-action-dashboard";
import { getMyWorkspaces } from "@/app/data-access/workspace/get-my-workspace";
import { unwrapServerData } from "@/utils/server-helpers";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect('/')
  }
  const workspaces = await getMyWorkspaces().then(unwrapServerData);

  return (
    <SidebarProvider>
      <AppSidebar workspaces={workspaces} userData={session} />
      <main className="relative md:w-[calc(100dvw-16.5rem)] w-full px-2 pt-4">
        <SidebarTrigger className="fixed" />
        <NotificationList />
        <UtilityActionDashboard />
        {children}
      </main>
    </SidebarProvider>
  )
}