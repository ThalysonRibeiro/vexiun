import getSession from "@/lib/getSession";
import { ProfileContent } from "./_components/profile-content";
import { redirect } from "next/navigation";
import { getDetailUser } from "@/app/data-access/user";
import { unwrapServerData } from "@/utils/server-helpers";

export default async function Profile() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }
  if (!session.user) return null;

  const detailUser = await getDetailUser().then(unwrapServerData);
  if (!detailUser) return null;

  return (
    <main className="container mx-auto px-6 pt-6">
      <ProfileContent sessionUser={session.user} detailUser={detailUser} />
    </main>
  );
}
