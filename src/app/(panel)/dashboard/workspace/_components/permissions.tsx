"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Check, X } from "lucide-react";

const permissions = [
  { action: "Ver workspace", viewer: true, member: true, admin: true, owner: true, },
  { action: "Editar informações do workspace", viewer: false, member: false, admin: true, owner: true, },
  { action: "Deletar workspace", viewer: false, member: false, admin: false, owner: true, },
  { action: "Convidar membros", viewer: false, member: false, admin: true, owner: true, },
  { action: "Remover membros", viewer: false, member: false, admin: true, owner: true, },
  { action: "Alterar cargos de membros", viewer: false, member: false, admin: false, owner: true, },
  { action: "Criar grupos", viewer: false, member: false, admin: true, owner: true, },
  { action: "Editar grupos", viewer: false, member: false, admin: true, owner: true, },
  { action: "Deletar grupos", viewer: false, member: false, admin: true, owner: true, },
  { action: "Criar items/tarefas", viewer: false, member: true, admin: true, owner: true, },
  { action: "Editar items/tarefas", viewer: false, member: false, admin: true, owner: true, },
  { action: "Deletar qualquer item", viewer: false, member: false, admin: false, owner: true, },
  { action: "Atribuir tarefas", viewer: false, member: false, admin: true, owner: true, },
  { action: "Ver todos os items", viewer: true, member: true, admin: true, owner: true, },
];

const roles = [
  { key: "viewer", label: "Viewer", description: "Visualização apenas", color: "text-gray-400" },
  { key: "member", label: "Member", description: "Colaborador", color: "text-gray-500" },
  { key: "admin", label: "Admin", description: "Administrador", color: "text-blue-500" },
  { key: "owner", label: "Owner", description: "Proprietário", color: "text-amber-500" },
];

export function PermissionsTable() {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h3 className="text-3xl font-bold mb-2">
          Permissões do Workspace
        </h3>
        <p className="text-gray-400">
          Entenda o que cada cargo pode fazer no Catalyst
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        {roles.map((role) => (
          <div key={role.key} className="flex items-center gap-2">
            <div className={`font-bold ${role.color}`}>{role.label}</div>
            <div className="text-sm text-gray-500">- {role.description}</div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="text-left p-4 font-semibold">Ação</TableHead>
              {roles.map((role) => (
                <TableHead key={role.key} className="text-center p-4 font-semibold">
                  <div className={role.color}>{role.label}</div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((permission, index) => (
              <TableRow
                key={index}
                className="border-b"
              >
                <TableCell>{permission.action}</TableCell>
                {roles.map((role) => (
                  <TableCell key={role.key} className="text-center">
                    {permission[role.key as keyof typeof permission] ? (
                      <div className="inline-flex items-center justify-center w-8 h-8">
                        <Check className="w-5 h-5 text-green-400" />
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-center w-8 h-8">
                        <X className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 space-y-2 text-sm text-gray-400">
        <p>
          <strong className="text-amber-400">Owner:</strong> Controle total do workspace, incluindo exclusão
        </p>
        <p>
          <strong className="text-blue-400">Admin:</strong> Pode gerenciar membros e todas as tarefas
        </p>
        <p>
          <strong className="text-gray-500">Member:</strong> Pode criar e gerenciar suas próprias tarefas
        </p>
        <p>
          <strong className="text-gray-400">Viewer:</strong> Apenas visualização, pode comentar
        </p>
      </div>
    </div>
  );
}