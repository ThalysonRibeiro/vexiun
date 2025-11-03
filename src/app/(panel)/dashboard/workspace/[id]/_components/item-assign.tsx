"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { useAssignTo } from "@/hooks/use-items";
import { useTeam } from "@/hooks/use-team";
import { isSuccessResponse } from "@/lib/errors";
import { cn } from "@/lib/utils";
import { nameFallback } from "@/utils/name-fallback";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ItemAssignProps {
  itemId: string;
  assignedToUser: TeamUser | null;
}

interface TeamUser {
  id: string;
  name: string | null;
  image: string | null;
  email: string;
}

export function ItemAssign({ itemId, assignedToUser }: ItemAssignProps) {
  const params = useParams();
  const workspaceId = params.id as string;
  const { data } = useTeam(workspaceId);
  const [selected, setSelected] = useState<TeamUser | null>();
  const assignTo = useAssignTo();
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleAssign = async () => {
    const result = await assignTo.mutateAsync({
      itemId: itemId,
      workspaceId: workspaceId,
      assignedTo: selected?.id as string
    });

    if (!isSuccessResponse(result)) {
      toast.error("Erro ao designar item");
    }
    toast.success("Item designado com sucesso!");
    setSelected(null);
    closeRef.current?.click();
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 overflow-y-scroll max-h-80">
        {data
          ?.filter((u) => u.user.id !== assignedToUser?.id)
          .map((menber) => (
            <button
              key={menber.user.id}
              onClick={() => setSelected(menber.user)}
              className={cn(
                "bg-accent rounded-full w-fit flex items-center gap-2 pr-3 cursor-pointer",
                "transition-colors duration-300",
                selected?.id === menber.user.id && "bg-primary text-white"
              )}
            >
              <Avatar>
                <AvatarImage className="h-12 w-12" src={menber.user?.image as string} />
                <AvatarFallback>{nameFallback(menber.user?.name as string)}</AvatarFallback>
              </Avatar>
              <span>{menber.user?.name?.split(" ")[0] ?? "CATALYST"}</span>
            </button>
          ))}
      </div>
      <Button onClick={handleAssign}>Designar</Button>
      <DialogClose ref={closeRef} className="hidden" />
    </>
  );
}
