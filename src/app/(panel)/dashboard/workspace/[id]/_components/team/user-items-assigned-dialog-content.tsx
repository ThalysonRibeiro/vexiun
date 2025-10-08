"use client"

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useState } from "react";
import { getItemsAssignedToUset } from "../../_data-access/get-items-assigned-to-user";
import { toast } from "sonner";
import { UserSearchType } from "@/app/(panel)/dashboard/_components/utility-action-dashboard/create-workspace";
import { Item } from "@/generated/prisma";


interface UserItemsAssignedDialogContentProps {
  userId: string | null
  // isOpen: boolean
  // onClose: (value: boolean) => void
}

type ItemAssignedToUser = {
  success: boolean,
  error?: string | null
  itemsAssigned: Item[]
  stats: Stats
}
type Stats = {
  done: number;
  pending: number;
  stopped: number;
  notStarted: number;
  total: number;
};

export function UserItemsAssignedDialogContent({
  userId,
}: UserItemsAssignedDialogContentProps
) {
  const [data, setData] = useState<ItemAssignedToUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      // getItemsAssignedToUset({ assignedTo: userId })
      //   .then(result => {
      //     if (result.success) {
      //       setData(result);
      //       setLoading(false);
      //       // onClose(true);
      //     } else {
      //       setLoading(false);
      //       // onClose(false);
      //     }
      //   })
      //   .catch(() => toast('Erro ao carregar tarefas'))
      //   .finally(() => setLoading(false))

    }
  }, [userId]);
  if (!userId) return null
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Detalhes de { }</DialogTitle>
        <DialogDescription>
          Todos os detalhes do usuário e items/tarefas associados a { }
        </DialogDescription>
      </DialogHeader>

      <div>{data?.stats.total}</div>
    </DialogContent>
  )
}