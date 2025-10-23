"use client"

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useItemsAssociatedWithMember } from "@/hooks/use-items";
import { colorStatus, statusMap } from "@/utils/colorStatus";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Link as LinkLu } from "lucide-react";
import { Button } from "@/components/ui/button";


interface ItemsAssociatedWithMemberProps {
  workspaceId: string;
  memberId: string;
  member: string | null;
}

export function ItemsAssociatedWithMember({
  member, workspaceId, memberId
}: ItemsAssociatedWithMemberProps
) {
  const { data, isLoading, error } = useItemsAssociatedWithMember(workspaceId, memberId);
  const hasMore = (data?.items?.length ?? 0) >= 100;
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Ressumo rápido do progresso de {member}</DialogTitle>
        <DialogDescription>
          {data?.member?.joinedAt && (
            <>
              Membro {formatDistanceToNow(
                new Date(data.member.joinedAt),
                { addSuffix: true, locale: ptBR }
              )}
            </>
          )}
        </DialogDescription>
      </DialogHeader>

      <Button variant={"outline"} size={"sm"} className="w-fit">
        <LinkLu />
        <Link href={`/dashboard/workspace/${workspaceId}/members/${memberId}}`}>
          Detalhes
        </Link>
      </Button>

      <ul className="border p-2 rounded max-h-100 overflow-y-auto">
        {data?.items.map((item, index) => (
          <li key={item.id} className={cn("min-w-0 flex items-center justify-between border-b")}>
            <p className="truncate">{index + 1} - {item.title}</p>
            <span className={cn("min-w-30 text-center text-sm rounded", colorStatus(item.status)
            )}>
              {statusMap[item.status]}
            </span>
          </li>
        ))}
      </ul>
      {hasMore && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          Mostrando primeiros 100 items
        </p>
      )}
    </DialogContent>
  )
}