"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useState } from "react"
import { CreateWorkspace } from "../../../_components/utility-action-dashboard/create-workspace"

export function DialogCreateWorkspace({ sidebar }: { sidebar: boolean }) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        {sidebar ? (
          <div className="cursor-pointer border rounded-md py-2 px-4 hover:bg-accent">
            <div className="flex items-center justify-betweenr gap-2.5">
              <div>Adicionar áreas de Trabalho</div>
              <Plus className="w-5 h-5 opacity-25" />
            </div>
          </div>
        ) : (
          <Card className="w-full h-full hover:border-primary/50 hover:bg-primary/20 transition-all duration-300 ease-in-out capitalize cursor-pointer">
            <CardHeader>
              <CardTitle>Adicionar Área de Trabalho</CardTitle>
              <CardDescription>Criar uma nova área de trabalho</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <Plus className="w-15 h-15 opacity-25" strokeWidth={.5} />
            </CardContent>
          </Card>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar área de trabalho</DialogTitle>
          <DialogDescription>
            Criar uma nova área de trabalho, prossiga com os passos abaixo.
          </DialogDescription>
        </DialogHeader>
        <CreateWorkspace setClose={() => setIsOpen(!isOpen)} />
      </DialogContent>
    </Dialog>
  )
}