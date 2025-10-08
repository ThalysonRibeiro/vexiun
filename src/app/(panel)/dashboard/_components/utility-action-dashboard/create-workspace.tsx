"use client"

import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { searchUsers } from "../../_data-access/search-users";
import { Check, Search, X } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { createWorkspace } from "../../_actions/create-workspace";
import { Step, Stepper } from "@/components/ui/stepper";
import { toast } from "sonner";
import { WorkspaceStepForm } from "./workspace-step-form";
import { useWorkspace, WorkspaceFormData } from "./use-workspace-form";

export type UserSearchType = {
  id: string,
  name: string | null,
  email: string,
  image: string | null
}

export function CreateWorkspace({ setClose }: { setClose: (value: boolean) => void }) {
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<UserSearchType[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserSearchType[]>([]);
  const [firstStepData, setFirstStepData] = useState<WorkspaceFormData>();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useWorkspace({});


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

  const onSubmit = async () => {
    setLoading(true);
    try {
      if (firstStepData?.title === undefined) {
        return;
      }
      const ids = selectedUsers.map(user => user.id);
      const response = await createWorkspace({
        title: firstStepData?.title,
        invitationUsersId: ids,
        revalidatePaths: ["/dashboard", "/dashboard/Workspaces"]
      });
      if (response.error) {
        toast.error("Erro ao cadastrar Workspace");
        return;
      }
      toast.success("Workspace cadastrada com sucesso!");
      form.reset();
      setUsers([]);
      setSelectedUsers([]);
      setQuery("");
      setFirstStepData(undefined);
      setClose(false);
    } catch (error) {
      toast.error("Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="">
      {loading && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-4 border-t-accent rounded-full animate-spin border-primary">
        </div>
      )}
      <Stepper
        onStepChange={(step) => {
          if (step === 2) {
            const values = form.getValues()
            setFirstStepData(values)
          }
        }}
        onFinalStepCompleted={async () => onSubmit()}
      >

        <Step>
          {({ next, canProceed }) => (
            <WorkspaceStepForm
              form={form}
              canProceed={canProceed}
            />
          )}
        </Step>



        <Step>
          {({ next }) => (
            <div className="space-y-4">
              <div className="relative space-y-4">
                <Search className="absolute right-1.5 -bottom-2.5 text-gray-500" />
                <label>Convidar Usuários</label>
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
          )}
        </Step>
      </Stepper>
    </div>
  )
}