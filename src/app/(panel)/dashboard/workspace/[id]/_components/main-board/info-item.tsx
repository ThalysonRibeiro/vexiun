"use client"
import { Button } from "@/components/ui/button"
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { colorPriority, colorStatus, priorityMap, statusMap } from "@/utils/colorStatus"
import { Edit } from "lucide-react"
import { useRef, useState } from "react"
import { CreateOrEditItemForm } from "./create-or-edit-item-form"
import { ItemWhitCreatedAssignedUser } from "../kanban/kanban-grid"

export function InfoItem({ data }: { data: ItemWhitCreatedAssignedUser }) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const shetRef = useRef<HTMLDivElement>(null);

  return (
    <SheetContent ref={shetRef} className="overflow-y-scroll ">
      <Button className="w-fit ml-4 mt-4 border-dashed" variant={"outline"}
        onClick={() => setIsEditing(prev => !prev)}
      >
        {isEditing ? 'Cancelar' : 'Editar'} <Edit />
      </Button>
      {isEditing ? (
        <>
          <div className="p-4 space-y-4">
            <CreateOrEditItemForm
              closeForm={() => setIsEditing(false)}
              initialValues={{
                title: data.title,
                term: data.term,
                priority: data.priority,
                status: data.status,
                notes: data.notes,
                description: data.description
              }}
              groupId={""}
              itemId={data.id}
              editingItem={true}
            />
          </div>
        </>
      ) : (
        <>
          <SheetHeader>
            <SheetTitle>
              {data.title[0].toUpperCase()}
              {data.title.slice(1)}
            </SheetTitle>
            <SheetDescription>
              {data.notes}
            </SheetDescription>
          </SheetHeader>
          <div className="p-4 space-y-4">

            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div className="flex flex-col text-sm">
                <span>
                  Prioridade:
                </span>
                <span className={cn("px-2 py-1 w-fit rounded-lg", colorPriority(data.priority))}>
                  {priorityMap[data.priority]}
                </span>
              </div>
              <div className="flex flex-col text-sm">
                <span>
                  Status:
                </span>
                <span className={cn("px-2 py-1 w-fit rounded-lg", colorStatus(data.status))}>
                  {statusMap[data.status]}
                </span>
              </div>
              <div className="flex flex-col text-sm">
                <span>
                  Prazo:
                </span>
                <span className={cn(
                  "px-2 py-1 w-fit rounded-lg",
                  new Date(data.term).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                )}>
                  {data.term ? new Date(data.term).toLocaleDateString() : "Não definido"}
                </span>
              </div>
            </div>

            <div className="text-sm">
              <span>
                Descrição:
              </span>
              <p className="mt-1 italic bg-accent p-2 rounded-lg border">
                {data.description}
              </p>
            </div>
          </div>
        </>
      )}
    </SheetContent>
  )
}