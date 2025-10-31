import { withAuthRoute } from "@/lib/api/with-auth-route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateWorkspaceAccess } from "@/lib/db/validators";

export const GET = withAuthRoute(async (req, userId, session, context) => {
  const { workspaceId } = await context!.params!;

  await validateWorkspaceAccess(workspaceId, userId);

  const team = await prisma.workspaceMember.findMany({
    where: {
      workspaceId
    },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });

  return NextResponse.json({
    success: true,
    data: team.map((member) => member.user)
  });
});
