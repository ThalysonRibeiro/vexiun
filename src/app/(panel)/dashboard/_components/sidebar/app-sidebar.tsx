"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Dock, Globe, Home
} from "lucide-react"
import Link from "next/link"
import { Menu } from "./menu"
import { Session } from "next-auth"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FaTasks } from "react-icons/fa"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { CatalystLogo } from "@/components/catalyst-logo"
import { WorkspaceSummaryData } from "@/app/data-access/workspace"
import { Prisma } from "@/generated/prisma"
import { BadgeWorkspace } from "@/components/badge-workspace"


type NavigationLink =
  | {
    title: string;
    url: string;
    icon: React.ElementType;
  }
  | {
    title: string;
    icon: React.ElementType;
    sublinks: {
      title: string;
      url: string;
    }[];
  };

const navigationLinks: NavigationLink[] = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Metas",
    icon: FaTasks,
    sublinks: [
      {
        title: "Visão Geral",
        url: "/dashboard/goals",
      },
      {
        title: "Métricas",
        url: "/dashboard/goals/metrics",
      },
    ],
  },
  {
    title: "Workspaces",
    url: "/dashboard/workspace",
    icon: Globe
  }
];

interface AppSidebarProps {
  workspaces: WorkspaceSummaryData;
  sharedWorkspaces: WorkspacesMenberWithWorkspace[];
  userData: Session;
}

type WorkspacesMenberWithWorkspace = Prisma.WorkspaceMemberGetPayload<{
  include: {
    workspace: true;
  };
}>;

type Workspace = {
  id: string;
  title: string;
}

export function AppSidebar({ workspaces, sharedWorkspaces, userData }: AppSidebarProps) {
  const pathname = usePathname();

  if (!workspaces) {
    return null;
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <CatalystLogo showText={false} />
          <span className="font-semibold text-lg">Espaço de trabalho</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Painel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationLinks.map((link) => (
                <div key={link.title}>
                  {('sublinks' in link) ? (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full justify-start cursor-pointer">
                          <link.icon className="h-4 w-4" />
                          <span>{link.title}</span>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-4">
                        <SidebarMenu>
                          {link.sublinks.map((sublink) => (
                            <SidebarMenuItem
                              key={sublink.title}
                              className={cn("",
                                pathname === sublink.url && "border border-primary rounded-md")}
                            >
                              <SidebarMenuButton asChild>
                                <Link href={sublink.url}>
                                  <span>{sublink.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem
                      className={cn("",
                        pathname === link.url && "border border-primary rounded-md")}
                    >
                      <SidebarMenuButton asChild>
                        <Link href={link.url}>
                          <link.icon className="h-4 w-4" />
                          <span>{link.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* compartilhadas */}
        <SidebarGroup>
          <SidebarGroupLabel>Workspaces Compartilhadas</SidebarGroupLabel>
          <SidebarGroupContent>

            <SidebarMenu>
              {sharedWorkspaces.map((shared) => (
                <div key={shared.workspace.id}>
                  <SidebarMenuItem>
                    <div className={cn("flex items-center w-full",
                      pathname === `/dashboard/workspace/${shared.workspace.id}` && "border border-primary rounded-md")
                    }>
                      <SidebarMenuButton asChild className="flex-1">
                        <Link href={`/dashboard/workspace/${shared.workspace.id}`}>
                          <Dock className="h-4 w-4" />
                          <span className="truncate">{shared.workspace.title}</span>
                          <BadgeWorkspace role={shared.role} className="ml-auto" />
                        </Link>
                      </SidebarMenuButton>

                    </div>
                  </SidebarMenuItem>
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter>
        <Menu userData={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}