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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dock,
  MoreHorizontal,
  Home, Edit2, Trash
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState, useCallback, startTransition } from "react"
import { Menu } from "./menu"
import { Session } from "next-auth"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { FaTasks } from "react-icons/fa"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DialogCreateWorkspace } from "../../workspace/[id]/_components/dialog-create-workspace"
import { WorkspaceForm } from "./workspace-form"
import { CatalystLogo } from "@/components/catalyst-logo"
import { WorkspaceSummaryData } from "@/app/data-access/workspace"
import { useDeleteWorkspace } from "@/hooks/use-workspace"
import { isSuccessResponse } from "@/lib/errors"


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
];

interface AppSidebarProps {
  workspaces: WorkspaceSummaryData;
  userData: Session;
}

type Workspace = {
  id: string;
  title: string;
}

interface EditingState {
  isEditing: boolean;
  workspace: Workspace | null;
}

export function AppSidebar({ workspaces, userData }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter()
  const [editingState, setEditingState] = useState<EditingState>({
    isEditing: false,
    workspace: null
  });
  const [deletingWorkspaceId, setDeletingWorkspaceId] = useState<string | null>(null);
  const deleteWorkspace = useDeleteWorkspace();

  const handleStartEditingWorkspace = useCallback((workspace: Workspace) => {
    setEditingState({
      isEditing: true,
      workspace
    });
  }, []);

  const handleFinishEditingWorkspace = useCallback((value: boolean) => {
    setEditingState({
      isEditing: value,
      workspace: value ? editingState.workspace : null
    });
    return value;
  }, [editingState.workspace]);

  const handleDeleteWorkspace = useCallback(async (workspaceId: string) => {
    if (!confirm('Deseja realmente deletar a workspace? Todos os grupos e items serão deletados juntos.')) {
      return;
    }
    if (deletingWorkspaceId) return;

    setDeletingWorkspaceId(workspaceId);

    const response = await deleteWorkspace.mutateAsync({ workspaceId });
    if (!isSuccessResponse(response)) {
      toast.error("Erro inesperado ao deletar Workspace");
      window.location.href = "/dashboard";
      toast.error("Erro ao deletar workspace");
      return;
    }

    toast.success(response.data);
    window.location.href = "/dashboard";
    setDeletingWorkspaceId(null);

  }, [deletingWorkspaceId, deleteWorkspace]);

  const isWorkspaceBeingEdited = (workspaceId: string) => {
    return editingState.isEditing && editingState.workspace?.id === workspaceId;
  };

  const isWorkspaceBeingDeleted = (workspaceId: string) => {
    return deletingWorkspaceId === workspaceId;
  };

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

        <SidebarGroup>
          <SidebarGroupLabel>WorkSpaces</SidebarGroupLabel>
          <SidebarGroupContent>
            {/* Add Workspace Section */}
            <div className="w-full mb-2">
              <DialogCreateWorkspace
                sidebar
                isNoWorkspace={workspaces.length === 0 ? true : false} />
            </div>

            {/* Workspace List */}
            <SidebarMenu>
              {workspaces.map((workspace) => (
                <div key={workspace.id}>
                  {isWorkspaceBeingEdited(workspace.id) ? (
                    <div className="px-2">
                      <WorkspaceForm
                        workspaceId={editingState.workspace?.id}
                        initialValues={{
                          title: editingState.workspace?.title || ""
                        }}
                        setAddWorkspace={handleFinishEditingWorkspace}
                      />
                    </div>
                  ) : (
                    <SidebarMenuItem>
                      <div className={cn("flex items-center w-full",
                        pathname === `/dashboard/workspace/${workspace.id}` && "border border-primary rounded-md")
                      }>
                        <SidebarMenuButton asChild className="flex-1">
                          <Link href={`/dashboard/workspace/${workspace.id}`}>
                            <Dock className="h-4 w-4" />
                            <span className="truncate">{workspace.title}</span>
                          </Link>
                        </SidebarMenuButton>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              disabled={isWorkspaceBeingDeleted(workspace.id)}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Opções para {workspace.title}</span>
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Opções</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => handleStartEditingWorkspace(workspace)}
                              className="cursor-pointer"
                            >
                              <Edit2 className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleDeleteWorkspace(workspace.id)}
                              disabled={isWorkspaceBeingDeleted(workspace.id)}
                              className="cursor-pointer"
                              variant="destructive"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              {isWorkspaceBeingDeleted(workspace.id) ? "Deletando..." : "Deletar"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </SidebarMenuItem>
                  )}
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