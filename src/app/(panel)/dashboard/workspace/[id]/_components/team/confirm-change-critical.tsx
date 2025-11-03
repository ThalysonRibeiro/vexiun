"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { memo } from "react";
import { badges } from "@/components/badge-workspace";
import { WorkspaceRole } from "@/generated/prisma";

interface ListMembersProps {
  confirmDialog: {
    open: boolean;
    memberId: string;
    newRole: WorkspaceRole;
    currentRole: WorkspaceRole;
  } | null;
  onConfirmDialog: (
    value: {
      open: boolean;
      memberId: string;
      newRole: WorkspaceRole;
      currentRole: WorkspaceRole;
    } | null
  ) => void;
  executeRoleChange: (memberId: string, newRole: WorkspaceRole) => void;
}

export const ConfirmChangeCriticalRole = memo(function ConfirmChangeCriticalRole(
  props: ListMembersProps
) {
  const { confirmDialog, onConfirmDialog, executeRoleChange } = props;
  return (
    <Dialog
      open={confirmDialog?.open ?? false}
      onOpenChange={(open) => !open && onConfirmDialog(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Confirmar alteração de Role
          </DialogTitle>
          <DialogDescription className="space-y-3 pt-2">
            <span className="block">
              Você está prestes a alterar a role de{" "}
              <span className="font-semibold">
                {badges[confirmDialog?.currentRole ?? "MEMBER"].label}
              </span>{" "}
              para{" "}
              <span className="font-semibold">
                {badges[confirmDialog?.newRole ?? "MEMBER"].label}
              </span>
            </span>

            <span className="block bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3">
              <span className="text-sm text-amber-800 dark:text-amber-200">
                {confirmDialog?.newRole === "OWNER" &&
                  "⚠️ O proprietário tem controle total do workspace, incluindo deletá-lo."}
                {confirmDialog?.newRole === "ADMIN" &&
                  "⚠️ Administradores podem gerenciar membros e configurações do workspace."}
                {confirmDialog?.currentRole === "OWNER" &&
                  "⚠️ Você está removendo privilégios de proprietário deste usuário."}
                {confirmDialog?.currentRole === "ADMIN" &&
                  "⚠️ Você está removendo privilégios de administrador deste usuário."}
              </span>
            </span>

            <span className="text-sm">Deseja continuar?</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onConfirmDialog(null)}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (confirmDialog) {
                executeRoleChange(confirmDialog.memberId, confirmDialog.newRole);
              }
            }}
          >
            Confirmar alteração
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
