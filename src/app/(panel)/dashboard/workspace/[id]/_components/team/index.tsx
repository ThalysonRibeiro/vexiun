"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { UserSearchType } from "@/app/(panel)/dashboard/_components/utility-action-dashboard/create-workspace";
import { toast } from "sonner";
import { CardUser } from "@/components/card-user";
import { UserItemsAssignedDialogContent } from "./user-items-assigned-dialog-content";
import { isSuccessResponse } from "@/lib/errors/error-handler";
import { UserSearch, UserSearchRef } from "@/components/user-search";
import { useTeam } from "@/hooks/use-team";
import { useAddWorkspaceMember } from "@/hooks/use-workspace";


export function Team({ workspaceId }: { workspaceId: string }) {
  const [selectedUsers, setSelectedUsers] = useState<UserSearchType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const userSearchRef = useRef<UserSearchRef>(null);
  const { data, isLoading, error } = useTeam(workspaceId);
  const addWorkspaceMember = useAddWorkspaceMember();

  // Obter IDs de usuários que já são membros para excluí-los da busca
  const existingMemberIds = data?.map(member => member.id) || [];

  const onSubmit = async () => {
    const ids = selectedUsers.map(user => user.id);

    if (ids.length <= 0) {
      toast("Nenhum usuário selecionado");
      return;
    }

    setLoading(true);
    try {
      const response = await addWorkspaceMember.mutateAsync({
        workspaceId,
        invitationUsersId: ids,
        revalidatePaths: ["/dashboard", "/dashboard/Workspaces"]
      });

      if (!isSuccessResponse(response)) {
        toast.error("Erro ao cadastrar Workspace");
        return;
      }

      toast.success(response.message);
      setSelectedUsers([]);
      userSearchRef.current?.reset();
    } catch (error) {
      toast.error("Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 mb-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            Convidar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar Usuários</DialogTitle>
            <DialogDescription>
              Selecione os usuários que deseja convidar para o time.
            </DialogDescription>

            <div className="space-y-4">
              <UserSearch
                ref={userSearchRef}
                theResults={setSelectedUsers}
                excludeUserIds={existingMemberIds}
                placeholder="Buscar por nome ou email..."
                showSelectedCount={true}
                customTitle="Selecione os usuários que deseja convidar"
                titleVisible={false}
              />
            </div>

            {selectedUsers.length > 0 && (
              <Button
                disabled={loading}
                onClick={onSubmit}
                className="cursor-pointer"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Enviar"}
              </Button>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {data?.length === 0 ? (
        <p>Nenhum membro no time</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {data?.map((user) => (
            <Dialog key={user.id}>
              <DialogTrigger className="text-left cursor-pointer">
                <CardUser user={user} />
              </DialogTrigger>
              <UserItemsAssignedDialogContent userId={user.id} />
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
};