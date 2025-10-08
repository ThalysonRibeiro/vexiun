"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CardContent } from "@/components/ui/card"
import { MessageCirclePlus, Search, Users } from "lucide-react"
import { UserSearch } from "../../_components/utility-action-dashboard/user-search"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { FriendsType } from "./friends-content"
import { useMemo, useState } from "react"
import { deleteFriendship } from "../_action/delete-friend"
import { InviteToWorkspace } from "./invite-to-workspaces"

type RequestType = "accepted" | "pending"

export function FriendList({ data, requestType }: { data: FriendsType[], requestType: RequestType }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const filteredaccepted = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const term = searchTerm.toLowerCase().trim();
    return data.filter(friend =>
      friend.user.name?.toLowerCase().includes(term) ||
      friend.user.email?.toLowerCase().includes(term)
    );
  }, [data, searchTerm]);

  const handleDelete = async (friendshipId: string) => {
    await deleteFriendship({ friendshipId });
  }


  return (
    <CardContent className="space-y-4">
      {data?.length === 0 ? (
        <div className="py-2 space-y-4 text-center text-zinc-500">
          <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Voçê não tem amigos ainda, adicione um agora!</p>
          <UserSearch />
        </div>
      ) : (
        <>
          <div className="relative">
            <Search className="absolute right-1.5 top-1.5 text-gray-500" />
            <Input
              placeholder="Pesquisar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-h-[calc(100vh-10rem))]">
            {filteredaccepted.length === 0 ? (
              <div className="col-span-full text-center py-8 text-zinc-500">
                <p className="text-sm">Nenhum resultado encontrado</p>
              </div>
            ) : (
              <>
                {filteredaccepted.map(friend => (
                  <div
                    key={friend.user.id}
                    className={cn("flex flex-col gap-3 p-1.5 border rounded-lg hover:bg-accent")}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {friend.user.image && (
                        <Avatar className="w-15 h-15 border">
                          <AvatarImage src={friend.user.image as string} />
                          <AvatarFallback>
                            {friend?.user.name?.split(" ")[0].slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex-1">
                        <p className="font-medium truncate">{friend.user.name}</p>
                        <p className="text-[12px] text-gray-500">
                          {friend.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center w-full gap-2">
                      <Button
                        size={"sm"}
                        variant={"destructive"}
                        className="cursor-pointer"
                        onClick={() => handleDelete(friend.friendshipId)}

                      >
                        Excluir
                      </Button>
                      {requestType === "accepted" && (
                        <>
                          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                            <DialogTrigger asChild>
                              <Button size={"sm"} className="cursor-pointer">
                                Convidar
                              </Button>
                            </DialogTrigger>
                            <InviteToWorkspace
                              userId={friend.user.id}
                              setClose={() => setOpenDialog(!openDialog)}
                            />

                          </Dialog>

                          <Button size={"sm"} className="ml-auto cursor-pointer">
                            <MessageCirclePlus className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </CardContent>
  )
}