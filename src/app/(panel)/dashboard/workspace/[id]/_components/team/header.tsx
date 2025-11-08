"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { memo, RefObject } from "react";
import { UserSearch, UserSearchRef } from "@/components/user-search";
import { UserSearchType } from "@/app/(panel)/dashboard/_components/utility-action-dashboard/create-workspace";

interface ListMembersProps {
  userSearchRef: RefObject<UserSearchRef | null>;
  onSelectedUsers: (users: UserSearchType[]) => void;
  selectedUsers: UserSearchType[];
  existingMemberIds: string[];
  loading: boolean;
  onSubmit: () => Promise<void>;
}

export const HeaderTeam = memo(function HeaderTeam(props: ListMembersProps) {
  const { userSearchRef, onSelectedUsers, selectedUsers, existingMemberIds, loading, onSubmit } =
    props;
  return (
    <div className="flex items-center gap-2">
      <Users />
      <h2 className="font-medium text-xl">Gerenciar Membros</h2>
      <Dialog>
        <DialogTrigger asChild className="ml-auto">
          <Button variant={"outline"}>Convidar</Button>
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
                theResults={onSelectedUsers}
                excludeUserIds={existingMemberIds}
                placeholder="Buscar por nome ou email..."
                showSelectedCount={true}
                customTitle="Selecione os usuários que deseja convidar"
                titleVisible={false}
              />
            </div>

            {selectedUsers.length > 0 && (
              <Button disabled={loading} onClick={onSubmit} className="cursor-pointer">
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Enviar"}
              </Button>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
});
