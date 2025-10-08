"use client"
import { useState, useEffect } from "react";
import { searchUsers } from "../../_data-access/search-users";
import { useDebounce } from "@/hooks/use-debounce";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Check, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { sendFriendRequest } from "../../_actions/send-request-frend";
import { toast } from "sonner";

type UserSearchType = {
  id: string,
  name: string | null,
  email: string,
  image: string | null
}

export function UserSearch() {
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<UserSearchType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<UserSearchType[]>([]);

  const { data: session } = useSession();

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    async function search() {
      if (debouncedQuery.trim().length < 2) {
        setUsers([]);
        return;
      }

      setLoading(true);
      const result = await searchUsers({ query: debouncedQuery });

      if (result.success) {
        setUsers(result?.data);
      }
      setLoading(false);
    }

    search();
  }, [debouncedQuery]);

  const toggleUser = (user: UserSearchType) => {
    setSelectedUsers(prev => {
      const exists = prev.find(u => u.id === user.id);
      if (exists) {
        return prev.filter(u => u.id !== user.id);
      }
      return [...prev, user];
    });
  };

  const isSelected = (userId: string) => selectedUsers.some(u => u.id === userId);

  if (!session?.user?.id) return null;

  /**
   * Função para enviar múltiplos convites
   */
  const sendAllFriendRequest = async (selectedUsers: UserSearchType[]) => {
    const results = await Promise.allSettled(
      selectedUsers.map((user) => sendFriendRequest({ addresseeId: user.id }))
    );

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
  };

  return (
    <div className="relative space-y-4">
      <Search className="absolute right-1.5 top-1.5 text-gray-500" />
      <Input
        type="text"
        placeholder="Buscar por nome ou email..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map(user => (
            <div
              key={user.id}
              className="flex items-center gap-2 bg-gradient-to-br from-primary to-orange-500 text-white px-3 py-1 rounded-full"
            >
              <span>{user.name}</span>
              <button
                onClick={() => toggleUser(user)}
                className="text-zinc-950 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
        {loading && (
          <div className="p-4 text-center text-gray-500">
            Buscando...
          </div>
        )}

        {!loading && users.length === 0 && query.length >= 2 && (
          <div className="p-4 text-center text-gray-500">
            Nenhum usuário encontrado
          </div>
        )}

        {!loading && users.map(user => (
          <div
            key={user.id}
            onClick={() => toggleUser(user)}
            className={`flex items-center gap-1 p-1.5 border rounded-lg hover:bg-accent cursor-pointer ${isSelected(user.id) ? 'bg-accent' : ''}`}
          >
            {user.image && (
              <Image
                src={user.image}
                alt={user.name as string}
                width={50}
                height={50}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div className="flex-1">
              <p className="font-medium text-sm truncate max-w-35">{user.name}</p>
              <p className="text-[12px] truncate max-w-36 text-gray-500">{user.email}</p>
            </div>
            {isSelected(user.id) && (
              <span className="text-green-500"><Check className="w-4 h-4" /></span>
            )}
          </div>
        ))}
      </div>

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
