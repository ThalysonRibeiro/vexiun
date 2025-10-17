"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Collapsible,
  CollapsibleContent
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Check, ChevronDown, CircleAlert, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { colorPriority, colorStatus } from "@/utils/colorStatus";
import { format } from "date-fns";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { usePagination } from "@/hooks/use-pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { DetailsEditor } from "./details-editor";
import { JSONContent } from "@tiptap/core";
import { nameFallback } from "@/utils/name-fallback";
import { useCompletedItems, useItems } from "@/hooks/use-items";
import { useParams } from "next/navigation";

export function CompletedItems() {
  const params = useParams();
  const workspaceId = params.id as string;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data: items, isLoading: isLoading, error } = useCompletedItems(workspaceId);

  const pagination = usePagination(items ?? [], 10);

  if (!items || items.length === 0) {
    return;
  };

  if (isLoading) {
    return <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-4 border-t-accent rounded-full animate-spin border-primary">
    </div>
  }

  return (
    <div className="w-full mb-6">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-green-500 text-lg font-bold">Concluídos: <span className="text-sm font-normal">
          ({items?.length})</span>
        </h3>
        <button className="cursor-pointer" onClick={() => setIsOpen(prev => !prev)}>
          <ChevronDown className={cn("cursor-pointer transition-all duration-300", isOpen && "-rotate-90")} />
        </button>
      </div>
      <Collapsible
        open={isOpen}
        className="ml-6 space-y-4 border-l border-green-500 pl-4">
        <CollapsibleContent>

          <div className="w-full overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titulo</TableHead>
                  <TableHead className="border-l">Notas</TableHead>
                  <TableHead className="max-w-25 overflow-hidden border-x">Responsável</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead className="border-x">Prazo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center border-l">Descrição</TableHead>
                  <TableHead className="text-center border-l">Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.currentItems.map(item => {
                  const titleCapitalized = item.title[0].toUpperCase() + item.title.slice(1);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="flex items-center justify-between min-w-30 w-full">
                        <p className="overflow-hidden max-w-80 text-ellipsis truncate" >
                          {titleCapitalized}
                        </p>
                      </TableCell>
                      <TableCell className="max-w-90 border-l">
                        <p className="overflow-hidden text-ellipsis" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          lineHeight: '1.4em',
                          maxHeight: '2.8em'
                        }}>
                          {item.notes}
                        </p>
                      </TableCell>
                      <TableCell className="border-x">
                        <div className="flex items-center gap-2 h-full w-full">
                          <Avatar>
                            <AvatarImage src="https://lh3.googleusercontent.com/a/ACg8ocK1ykRmdptZ0O2ILjQZPecUAK03e4jIiW51WP_jLC-fti8ZXzab=s96-c" />
                            <AvatarFallback>F</AvatarFallback>
                          </Avatar>
                          <div>{nameFallback("name user")}</div>
                        </div>
                      </TableCell>
                      <TableCell className={colorPriority(item.priority)}>
                        {item.priority}
                      </TableCell>
                      <TableCell className="border-x w-fit">
                        <div className="flex items-center gap-2">
                          {new Date(item.term) < new Date() && (
                            <div className="flex items-center gap-1">
                              {item.status === 'DONE' ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <CircleAlert className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                          )}
                          <div

                            className={cn(
                              "cursor-pointer hover:bg-accent p-1 rounded transition-colors",
                              new Date(item.term) < new Date() && item.status !== 'DONE' && "text-red-600 font-semibold"
                            )}
                            title="Clique para editar"
                          >
                            {format(item.term, "dd/MM/yyyy")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className={colorStatus(item.status)}>
                        {item.status}
                      </TableCell>
                      <TableCell className="max-w-90 border-l">
                        <p className="overflow-hidden text-ellipsis" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          lineHeight: '1.4em',
                          maxHeight: '2.8em'
                        }}>
                          {item.description}
                        </p>
                      </TableCell>
                      <TableCell className="border-l flex items-center justify-center">
                        <Dialog>
                          <DialogTrigger className="cursor-pointer flex items-center gap-2 hover:bg-accent p-1 rounded transition-colors group">
                            <Eye className="h-4 w-4" /> Visualizar
                          </DialogTrigger>
                          <DialogContent
                            className="min-h-50 max-h-[calc(100dvh-3rem)] min-w-[calc(100dvw-20rem)] overflow-hidden"
                          >
                            <DialogHeader>
                              <DialogTitle>Detalhes do item</DialogTitle>
                              <DialogDescription>
                                {`Visualizando detalhes de ${item.title || 'item'}`}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="pb-6 w-full overflow-y-scroll min-h-50 max-h-120">
                              <DetailsEditor
                                editable={false}
                                content={item.details as JSONContent}
                                onContentChange={() => { }}
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {items.length > 10 && (
            <PaginationControls {...pagination} />
          )}

        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}