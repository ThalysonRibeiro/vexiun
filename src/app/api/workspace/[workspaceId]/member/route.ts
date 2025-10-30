import { NextResponse } from "next/server";
import { NotFoundError } from "@/lib/errors";
import { validateWorkspaceAccess } from "@/lib/db/validators";
import { withAuthRoute } from "@/lib/api/with-auth-route";

export const GET = withAuthRoute(async (req, userId, session, context) => {
  const { workspaceId } = await context!.params!;
  const member = await validateWorkspaceAccess(workspaceId, userId);
  if (!member.workspace) {
    throw new NotFoundError("Workspace");
  }
  return NextResponse.json({
    success: true,
    data: {
      workspace: member.workspace,
      member: { role: member.role, userId: member.userId }
    }
  });
});