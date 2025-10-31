📊 Tabela de Permissões:
AçãoUSERADMINSUPER_ADMINVIEWERMEMBERWS_ADMINOWNERCriar
workspace✅✅✅----Ver workspace--✅✅✅✅✅
Editar workspace--✅❌❌✅✅
Adicionar membros--✅❌❌✅✅
Criar grupo--✅❌✅✅✅
Criar item--✅❌✅✅✅
Editar item próprio--✅❌✅✅✅
Editar qualquer item--✅❌❌✅✅
Deletar item próprio--✅❌✅✅✅
Deletar qualquer item--✅❌❌❌✅
Mudar roles globais❌❌✅❌❌❌❌

app/
└── actions/
├── user/
│ ├── create-user.ts
│ ├── update-user.ts
│ ├── delete-user.ts
│ ├── change-user-role.ts
│ └── index.ts # ✅ Exporta tudo (barrel export)
│
├── workspace/
│ ├── create-workspace.ts
│ ├── update-workspace.ts
│ ├── delete-workspace.ts
│ ├── add-member.ts
│ ├── remove-member.ts
│ ├── update-member-role.ts
│ └── index.ts
│
├── invitation/
│ ├── send-invitation.ts
│ ├── accept-invitation.ts
│ ├── decline-invitation.ts
│ ├── cancel-invitation.ts
│ ├── get-pending-invitations.ts
│ └── index.ts
│
├── item/
│ ├── create-item.ts
│ ├── update-item.ts
│ ├── delete-item.ts
│ ├── assign-item.ts
│ ├── complete-item.ts
│ └── index.ts
│
├── group/
│ ├── create-group.ts
│ ├── update-group.ts
│ ├── delete-group.ts
│ ├── reorder-groups.ts
│ └── index.ts
│
├── notification/
├── send-notification.ts
├── mark-as-read.ts
├── mark-all-as-read.ts
├── delete-notification.ts
└── index.ts

        // app/actions/workspace/index.ts

export { createWorkspace } from "./create-workspace";
export { updateWorkspace } from "./update-workspace";
export { deleteWorkspace } from "./delete-workspace";
export { addWorkspaceMember } from "./add-member";
export { removeWorkspaceMember } from "./remove-member";
export { updateMemberRole } from "./update-member-role";
