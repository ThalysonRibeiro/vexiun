"use client"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { EntityStatus, WorkspaceRole } from "@/generated/prisma";
import { ItemWhitCreatedAssignedUser } from "@/hooks/use-items";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { usePagination } from "@/hooks/use-pagination";
import { ActionItem } from "./action-item";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Check, Eye } from "lucide-react";
import { format } from "date-fns";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { InfoItem } from "./info-item";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useWorkspaceMemberData, useWorkspacePermissions } from "@/hooks/use-workspace";

interface ItemLifecycleViewProps {
  textColor?: string;
  items: ItemWhitCreatedAssignedUser[];
  changeLayout: boolean;
  isOpen?: boolean;
  entityStatus?: EntityStatus;
  isDone?: boolean;
  isLoading: boolean | string | null;
  onDeleteItem: (itemId: string) => void;
  onMoveToTrash: (itemId: string) => void;
  onArchiveItem: (itemId: string) => void;
  onRestoreItem: (itemId: string) => void;
}

function ItemLifecycleView(props: ItemLifecycleViewProps) {
  const {
    textColor = "#22c55e",
    entityStatus,
    isDone = false,
    items,
    changeLayout,
    isOpen = true,
    isLoading,
    onDeleteItem,
    onMoveToTrash,
    onArchiveItem,
    onRestoreItem
  } = props;
  const pagination = usePagination(items ?? [], 10);

  const { id: workspaceId } = useParams();
  const { data: session } = useSession();
  const { data: workspace } = useWorkspaceMemberData(workspaceId as string);

  const currentUserId = session?.user.id;
  const isOwner = workspace?.workspace.userId === currentUserId;
  const permissions = useWorkspacePermissions({
    userRole: workspace?.member.role as WorkspaceRole ?? "VIEWER",
    workspaceStatus: entityStatus as EntityStatus,
    isOwner
  });

  return (
    <>
      {changeLayout ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map(item => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="truncate">
                  <TitleItem title={item.title} />
                </CardTitle>
                <CardDescription></CardDescription>
                <CardAction>
                  {permissions.canRestore && (
                    <ActionItem
                      item={item}
                      team={[]}
                      isLoading={isLoading}
                      entityStatus={entityStatus}
                      isDone={isDone}
                      onDeleteItem={() => onDeleteItem(item.id)}
                      onMoveToTrash={() => onMoveToTrash(item.id)}
                      onArchiveItem={() => onArchiveItem(item.id)}
                      onRestoreItem={() => onRestoreItem(item.id)}
                    />
                  )}
                </CardAction>
              </CardHeader>

              <CardContent className="space-y-4">
                <AssignedToUserItem
                  image={item.assignedToUser?.image as string}
                  name={item.assignedToUser?.name as string}
                  label={true}
                  className="bg-accent p-1 rounded-md"
                />

                <TermItem
                  label={true}
                  updatedAt={item.updatedAt}
                  className="bg-green-500/20 p-1 rounded-md"
                />
              </CardContent>

              <CardFooter className="border-t">
                <DetailsItem item={item} />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Collapsible
          open={isOpen}
          className="ml-1 space-y-4 border-l pl-4"
          style={{ borderColor: textColor }}
        >
          <CollapsibleContent>
            <div className="w-full overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    {permissions.canRestore && <TableHead className="border-r">Ações</TableHead>}
                    <TableHead>Titulo</TableHead>
                    <TableHead className="text-center max-w-25 overflow-hidden border-x">
                      Responsável
                    </TableHead>
                    <TableHead className="text-center border-x">
                      Finalizado
                    </TableHead>
                    <TableHead className="text-center border-l">
                      Detalhes
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {pagination?.currentItems.map(item => (
                    <TableRow key={item.id}>
                      {permissions.canRestore && (
                        <TableCell className="py-0.5 border-r">
                          <ActionItem
                            item={item}
                            team={[]}
                            isLoading={isLoading}
                            entityStatus={entityStatus}
                            isDone={isDone}
                            onDeleteItem={() => onDeleteItem(item.id)}
                            onMoveToTrash={() => onMoveToTrash(item.id)}
                            onArchiveItem={() => onArchiveItem(item.id)}
                            onRestoreItem={() => onRestoreItem(item.id)}
                          />
                        </TableCell>
                      )}
                      <TableCell className="flex items-center justify-between min-w-30 w-full">
                        <div>
                          <TitleItem title={item.title} />
                        </div>
                      </TableCell>

                      <TableCell className="border-x py-0.5">
                        <AssignedToUserItem
                          image={item.assignedToUser?.image as string}
                          name={item.assignedToUser?.name as string}
                          label={false}
                          className="justify-center"
                        />
                      </TableCell>

                      <TableCell className="border-x w-fit py-0.5">
                        <TermItem
                          label={false}
                          updatedAt={item.updatedAt}
                        />
                      </TableCell>

                      <TableCell className="py-0.5">
                        <DetailsItem item={item} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {items.length > 10 && pagination && (
              <PaginationControls {...pagination} />
            )}
          </CollapsibleContent>
        </Collapsible>
      )}
    </>
  );
}


function TitleItem({ title }: { title: string }) {
  return (
    <div>
      {title[0].toUpperCase() + title.slice(1)}
    </div>
  )
}

function AssignedToUserItem({
  image, name, label, className
}: { image: string, name: string, label: boolean, className?: string }) {
  return (
    <div>
      {label && <label htmlFor="responsável" className="text-muted-foreground text-sm">Responsável</label>}
      <div className={cn("flex items-center gap-2 h-full w-full", className)}>
        <Avatar>
          <AvatarImage src={image} />
          <AvatarFallback>
            {(name)[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>{name?.split(' ')[0]}</div>
      </div>
    </div>
  )
}

function TermItem({
  updatedAt, label, className
}: { updatedAt: Date, label: boolean, className?: string }) {
  return (
    <div>
      {label && <label htmlFor="prazo" className="text-muted-foreground text-sm">Prazo</label>}
      <div className={cn("flex items-center justify-center gap-2 w-full", className)}>
        <div className="flex items-center gap-1">
          <Check className="h-4 w-4 text-green-600" />
        </div>
        <div
          className={cn(
            "cursor-pointer hover:bg-accent p-1 rounded transition-colors",
          )}
          title="Clique para editar"
        >
          {format(updatedAt, "dd/MM/yyyy")}
        </div>
      </div>
    </div>
  )
}

function DetailsItem({ item }: { item: ItemWhitCreatedAssignedUser }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="w-full cursor-pointer"
          variant={"outline"}
        >
          <Eye /> Detalhes do item
        </Button>
      </SheetTrigger>
      <InfoItem data={item} editable={false} team={[]} />
    </Sheet>
  )
}

export {
  ItemLifecycleView,
  TitleItem,
  AssignedToUserItem,
  TermItem,
  DetailsItem
}