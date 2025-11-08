import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/app/(panel)/dashboard/_components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationList } from "./_components/notification";
import { UtilityActionDashboard } from "@/app/(panel)/dashboard/_components/utility-action-dashboard";
import { getMyWorkspaces } from "@/app/data-access/workspace/get-my-workspace";
import { unwrapServerData } from "@/utils/server-helpers";
import { getSharedWorkspaces } from "@/app/data-access/workspace/get-shared-workspaces";
import { MainSaidebar } from "@/components/main-sidebar";
import { getCountMyPendingInvitations } from "@/app/data-access/user";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }
  const workspaces = await getMyWorkspaces().then(unwrapServerData);
  const sharedWorkspaces = await getSharedWorkspaces().then(unwrapServerData);
  const countPendingInvitations = await getCountMyPendingInvitations().then(unwrapServerData);

  const comomProps = {
    workspaces,
    sharedWorkspaces,
    countPendingInvitations,
    userData: session
  };

  return (
    <SidebarProvider>
      <AppSidebar {...comomProps} />
      <MainSaidebar>
        <SidebarTrigger className="fixed" />
        <NotificationList />
        <UtilityActionDashboard />
        {children}
      </MainSaidebar>
    </SidebarProvider>
  );
}
