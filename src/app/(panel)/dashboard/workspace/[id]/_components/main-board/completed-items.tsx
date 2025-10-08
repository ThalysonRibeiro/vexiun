"use client"
import {
  Table,
  TableBody,
  TableCaption,
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
import { Check, ChevronDown, CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { GroupWithItems } from "./groups";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { colorPriority, colorStatus } from "@/utils/colorStatus";
import { format } from "date-fns";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { usePagination } from "@/hooks/use-pagination";
import { DescriptionEditor } from "./description-editor";

export function CompletedItems({ groupsData }: { groupsData: GroupWithItems[] }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);


  const completedItems = groupsData.flatMap(group =>
    group.item.filter(item => item.status === 'DONE')
  );
  const pagination = usePagination(completedItems, 10);

  if (completedItems.length === 0) {
    return;
  };

  return (
    <div className="w-full mb-6">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-green-500 text-lg font-bold">Concluídos: <span className="text-sm font-normal">({completedItems.length})</span></h3>
        <button className="cursor-pointer" onClick={() => setIsOpen(prev => !prev)}>
          <ChevronDown className={cn("cursor-pointer transition-all duration-300", isOpen && "-rotate-90")} />
        </button>
      </div>
      <Collapsible
        open={isOpen}
        className="ml-6 space-y-4 border-l border-green-500 pl-4">
        <CollapsibleContent>
          {/* <ItemsTables items={completedItems} /> */}

          <div className="w-full overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titulo</TableHead>
                  <TableHead className="max-w-13 overflow-hidden border-x">Responsável</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead className="border-x">Prazo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center border-l">Descrição</TableHead>
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
                      <TableCell className="border-x">
                        <Avatar>
                          <AvatarImage src="https://lh3.googleusercontent.com/a/ACg8ocK1ykRmdptZ0O2ILjQZPecUAK03e4jIiW51WP_jLC-fti8ZXzab=s96-c" />
                          <AvatarFallback>F</AvatarFallback>
                        </Avatar>
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
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {completedItems.length > 10 && (
            <PaginationControls {...pagination} />
          )}

        </CollapsibleContent>
        <DescriptionEditor />
      </Collapsible>
    </div>
  )
}