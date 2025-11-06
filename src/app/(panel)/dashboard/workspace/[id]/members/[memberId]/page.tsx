import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import MemberDetailContent from "./_components/member-detail-content";
import { validateWorkspacePermission } from "@/lib/db/validators";

export default async function MemberDetailPage({
  params
}: {
  params: Promise<{ id: string; memberId: string }>;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/signin");
  }
  const workspaceId = (await params).id;
  const memberId = (await params).memberId;

  const currentMember = await validateWorkspacePermission(workspaceId, session.user.id, "ADMIN");

  const commonProps = {
    workspaceId,
    memberId
  };

  return <MemberDetailContent {...commonProps} />;
}
