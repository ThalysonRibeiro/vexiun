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
import { deleteWorkspace } from "../../_actions/delete-workspace"
import { toast } from "sonner"
import { useState, useCallback } from "react"
import { Menu } from "./menu"
import { Session } from "next-auth"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FaTasks } from "react-icons/fa"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DialogCreateWorkspace } from "../../workspace/[id]/_components/dialog-create-workspace"
import { WorkspaceForm } from "./workspace-form"
import { CatalystLogo } from "@/components/catalyst-logo"


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
  Workspaces: Workspace[];
  userData: Session;
}

type Workspace = {
  id: string;
  title: string;
};

interface EditingState {
  isEditing: boolean;
  Workspace: Workspace | null;
}

export function AppSidebar({ Workspaces, userData }: AppSidebarProps) {
  const pathname = usePathname();
  const [editingState, setEditingState] = useState<EditingState>({
    isEditing: false,
    Workspace: null
  });
  const [deletingWorkspaceId, setDeletingWorkspaceId] = useState<string | null>(null);

  const handleStartEditingWorkspace = useCallback((Workspace: Workspace) => {
    setEditingState({
      isEditing: true,
      Workspace
    });
  }, []);

  const handleFinishEditingWorkspace = useCallback((value: boolean) => {
    setEditingState({
      isEditing: value,
      Workspace: value ? editingState.Workspace : null
    });
    return value;
  }, [editingState.Workspace]);

  const handleDeleteWorkspace = useCallback(async (WorkspaceId: string) => {
    if (!confirm('Deseja realmente a área de trabalho?, todos os grupos e items serão deletados justos')) {
      return;
    }
    if (deletingWorkspaceId) return; // Prevent double deletion

    setDeletingWorkspaceId(WorkspaceId);

    try {
      const response = await deleteWorkspace(WorkspaceId);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success(response.data || "Workspace deletado com sucesso!");
    } catch (error) {
      toast.error("Erro inesperado ao deletar Workspace");
    } finally {
      setDeletingWorkspaceId(null);
    }
  }, [deletingWorkspaceId]);

  const isWorkspaceBeingEdited = (WorkspaceId: string) => {
    return editingState.isEditing && editingState.Workspace?.id === WorkspaceId;
  };

  const isWorkspaceBeingDeleted = (WorkspaceId: string) => {
    return deletingWorkspaceId === WorkspaceId;
  };

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
                        <SidebarMenuButton className="w-full justify-start">
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
          <SidebarGroupLabel>Áreas de Trabalho</SidebarGroupLabel>
          <SidebarGroupContent>
            {/* Add Workspace Section */}
            <div className="w-full mb-2">
              <DialogCreateWorkspace sidebar />
            </div>

            {/* Workspace List */}
            <SidebarMenu>
              {Workspaces.map((Workspace) => (
                <div key={Workspace.id}>
                  {isWorkspaceBeingEdited(Workspace.id) ? (
                    <div className="px-2">
                      <WorkspaceForm
                        WorkspaceId={editingState.Workspace?.id}
                        initialValues={{
                          title: editingState.Workspace?.title || ""
                        }}
                        setAddWorkspace={handleFinishEditingWorkspace}
                      />
                    </div>
                  ) : (
                    <SidebarMenuItem>
                      <div className={cn("flex items-center w-full",
                        pathname === `/dashboard/workspace/${Workspace.id}` && "border border-primary rounded-md")
                      }>
                        <SidebarMenuButton asChild className="flex-1">
                          <Link href={`/dashboard/workspace/${Workspace.id}`}>
                            <Dock className="h-4 w-4" />
                            <span className="truncate">{Workspace.title}</span>
                          </Link>
                        </SidebarMenuButton>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              disabled={isWorkspaceBeingDeleted(Workspace.id)}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Opções para {Workspace.title}</span>
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Opções</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => handleStartEditingWorkspace(Workspace)}
                              className="cursor-pointer"
                            >
                              <Edit2 className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleDeleteWorkspace(Workspace.id)}
                              disabled={isWorkspaceBeingDeleted(Workspace.id)}
                              className="cursor-pointer"
                              variant="destructive"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              {isWorkspaceBeingDeleted(Workspace.id) ? "Deletando..." : "Deletar"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </SidebarMenuItem>
                  )}
                </div>
              ))}
            </SidebarMenu>

            {Workspaces.length === 0 && (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                Nenhuma Workspace criada
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Menu userData={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}