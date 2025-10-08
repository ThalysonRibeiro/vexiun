"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useState } from "react";
import { UserSearchType } from "@/app/(panel)/dashboard/_components/utility-action-dashboard/create-workspace";
import { searchUsers } from "@/app/(panel)/dashboard/_data-access/search-users";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import { sendInviteToWorkspace } from "@/app/(panel)/dashboard/_actions/send-invite-to-workspace";
import { CardUser } from "@/components/card-user";
import { UserItemsAssignedDialogContent } from "./user-items-assigned-dialog-content";
import { TeamUser } from "../workspace-content";

export function Team({ team, workspaceId }: { team: TeamUser, workspaceId: string }) {
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<UserSearchType[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserSearchType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    async function search() {
      if (debouncedQuery.trim().length < 2) {
        setUsers([]);
        return;
      }

      setLoading(true);
      const search = await searchUsers({ query: debouncedQuery });

      if (search.success) {
        if ("error" in team) {
          return;
        }
        const filterUsers = search.data.filter(user => !team.some(t => t.id === user.id));
        setUsers(filterUsers);
      }
      setLoading(false);
    }

    search();
  }, [debouncedQuery, team]);

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

  const ids = selectedUsers.map(user => user.id);

  const onSubmit = async () => {
    setLoading(true);
    try {
      if (ids.length < 0) {
        toast("Nenhum usuário selecionado");
        return;
      }
      const response = await sendInviteToWorkspace({
        workspaceId,
        invitationUsersId: ids,
        revalidatePaths: ["/dashboard", "/dashboard/Workspaces"]
      });
      if (response.error) {
        toast.error("Erro ao cadastrar Workspace");
        return;
      }
      toast.success(`Convites enviados para: ${ids.length} ${ids.length > 1 ? "usuários" : "usuário"}`);
      setUsers([]);
      setSelectedUsers([]);
      setQuery("");
      setLoading(false);
    } catch (error) {
      toast.error("Erro inesperado");
    } finally {
      setLoading(false);
    }
  }


  if ("error" in team) {
    return <div className="text-destructive">Erro: {team.error}</div>;
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
              <div className="relative space-y-4">
                <Search className="absolute right-1.5 -bottom-2.5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Buscar por nome ou email..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

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

              <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
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
            </div>
            {ids.length > 0 && (
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
      {team.length === 0 ? (
        <p>Nenhum membro no time</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {team.map((user) => (


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