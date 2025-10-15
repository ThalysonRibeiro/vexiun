"use client"
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { inviteFriendship } from "@/app/actions/friendship";
import { UserSearch, UserSearchRef } from "@/components/user-search";
import { useInvalidateMyFrendse } from "@/hooks/use-friendship";

type UserSearchType = {
  id: string,
  name: string | null,
  email: string,
  image: string | null
}

export function SendFrendshipRequest({ excludeUserIds }: { excludeUserIds?: string[]; }) {
  const [selectedUsers, setSelectedUsers] = useState<UserSearchType[]>([]);
  const userSearchRef = useRef<UserSearchRef>(null);
  const invalidateMyFrendse = useInvalidateMyFrendse();


  /**
   * Função para enviar múltiplos convites
   */
  const sendAllFriendRequest = async (selectedUsers: UserSearchType[]) => {
    const results = await Promise.allSettled(
      selectedUsers.map((user) => inviteFriendship({ addresseeId: user.id }))
    );
    invalidateMyFrendse();

    return results.map((res, i) => {
      const userId = selectedUsers[i].id;

      if (res.status === "fulfilled") {
        const value = res.value;
        return {
          userId,
          success: "success" in value ? value.success : false,
          data: "data" in value ? value.data : undefined,
          error: "error" in value ? value.error : undefined
        };
      }

      return { userId, success: false, error: res.reason || "Erro desconhecido" };
    });
  };

  /**
   * Handler do botão de enviar
   */
  const handleSendRequests = async () => {
    const results = await sendAllFriendRequest(selectedUsers);

    results.forEach((res, i) => {
      const user = selectedUsers[i];

      if (res.success) {
        toast.success(`Solicitação enviada para ${user.name}`);
      } else {
        toast.error(res.error || `Erro ao enviar para ${user.name}`);
      }
    });


    setSelectedUsers([]);
    userSearchRef.current?.reset();
    invalidateMyFrendse();
  };

  return (
    <div className="space-y-4">
      <UserSearch
        ref={userSearchRef}
        excludeUserIds={excludeUserIds}
        theResults={setSelectedUsers}
        placeholder="Buscar por nome ou email..."
        showSelectedCount={true}
        customTitle="Enviar solicitação de amizade"
        titleVisible={false}
      />

      {selectedUsers.length > 0 && (
        <Button
          className="w-full cursor-pointer"
          onClick={handleSendRequests}
        >
          Enviar solicitação para {selectedUsers.length} usuário(s)
        </Button>
      )}
    </div>
  );
}
