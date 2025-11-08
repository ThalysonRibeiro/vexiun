"use client";
import { useTeam } from "@/hooks/use-team";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserSearch, UserSearchRef } from "./user-search";
import { useRef, useState } from "react";
import { UserSearchType } from "@/app/(panel)/dashboard/_components/utility-action-dashboard/create-workspace";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { isSuccessResponse } from "@/lib/errors";
import { useAddWorkspaceMember } from "@/hooks/use-workspace";

interface InviteMembersToWorkspacesProps {
  workspaceId: string;
  setClose: (value: boolean) => void;
}

export function InviteMembersToWorkspaces({
  workspaceId,
  setClose
}: InviteMembersToWorkspacesProps) {
  const { data } = useTeam(workspaceId);
  const addWorkspaceMember = useAddWorkspaceMember();
  const [selectedUsers, setSelectedUsers] = useState<UserSearchType[]>([]);
  const userSearchRef = useRef<UserSearchRef>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const existingMemberIds = data?.map((member) => member.user.id) || [];

  const onSubmit = async () => {
    const ids = selectedUsers.map((user) => user.id);

    if (ids.length <= 0) {
      toast("Nenhum usuário selecionado");
      return;
    }
    setLoading(true);
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
    setLoading(false);
    setClose(false);
  };

  return (
    <div className="space-y-4">
      <h3>Membros da equipe</h3>
      <div className="flex flex-wrap gap-4">
        {data?.map((member) => (
          <div key={member.user.id} className="relative group">
            <div className="flex items-center gap-2 border rounded-full hover:pr-3 bg-accent relative w-10 h-10 group-hover:w-64 overflow-hidden transition-all duration-300 ease-in-out">
              <Avatar className="w-10 h-10 flex-shrink-0">
                {member.user.image && (
                  <AvatarImage src={member.user.image} alt={`Avatar de ${member.user.name}`} />
                )}
                <AvatarFallback>
                  {member.user.name
                    ? member.user.name.charAt(0).toUpperCase()
                    : member.user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 whitespace-nowrap min-w-0">
                <p className="text-sm">{member.user.name}</p>
                <p className="text-xs">{member.user.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

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

        {selectedUsers.length > 0 && (
          <div className="flex justify-end">
            <Button className="btn btn-primary" onClick={() => onSubmit()}>
              {loading ? "Enviando..." : "Convidar Selecionados"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
