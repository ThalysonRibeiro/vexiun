import { Prisma } from "@/generated/prisma";

export type InvitesWithWorkspaceAndInviter = Prisma.WorkspaceInvitationGetPayload<{
  include: {
    workspace: {
      select: {
        id: true;
        title: true;
      };
    };
    inviter: {
      select: {
        name: true;
        image: true;
      };
    };
  };
}>;

export type SentInvite = Prisma.WorkspaceInvitationGetPayload<{
  include: {
    user: { select: { id: true; name: true; email: true; image: true } };
    inviter: { select: { name: true } };
    workspace: { select: { id: true; title: true } };
  };
}>;
