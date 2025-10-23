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
import { useCallback, useRef, useState } from "react";
import { UserSearchType } from "@/app/(panel)/dashboard/_components/utility-action-dashboard/create-workspace";
import { toast } from "sonner";
import { CardUser } from "@/components/card-user";
import { isSuccessResponse } from "@/lib/errors/error-handler";
import { UserSearch, UserSearchRef } from "@/components/user-search";
import { useTeam } from "@/hooks/use-team";
import { useAddWorkspaceMember } from "@/hooks/use-workspace";
import { ItemsAssociatedWithMember } from "./items-associated-with-member";
import { usePrefetchMemberItems } from "@/hooks/use-items";


export function Team({ workspaceId }: { workspaceId: string }) {
  const [selectedUsers, setSelectedUsers] = useState<UserSearchType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const userSearchRef = useRef<UserSearchRef>(null);
  const { data, isLoading, error } = useTeam(workspaceId);
  const addWorkspaceMember = useAddWorkspaceMember();
  const { prefetch } = usePrefetchMemberItems();
  const [prefetchedIds, setPrefetchedIds] = useState<Set<string>>(new Set());

  const handlePrefetch = (userId: string) => {
    prefetch(workspaceId, userId);
    setPrefetchedIds(prev => new Set(prev).add(userId));
  };

  const existingMemberIds = data?.map(member => member.id) || [];

  const onSubmit = async () => {
    const ids = selectedUsers.map(user => user.id);

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
  }

  return (
    <div className="mt-6 mb-6 flex flex-col">
      <Dialog>
        <DialogTrigger asChild className="mr-auto">
          <Button variant={"outline"}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {data?.map((user) => (
            <Dialog key={user.id} >
              <DialogTrigger
                className="text-left cursor-pointer"
                onMouseEnter={() => handlePrefetch(user.id)}
              >
                <div className="relative">
                  <CardUser user={user} />
                  {prefetchedIds.has(user.id) && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </div>
              </DialogTrigger>
              <ItemsAssociatedWithMember
                member={user?.name}
                workspaceId={workspaceId}
                memberId={user.id}
              />
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
};