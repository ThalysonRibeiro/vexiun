import { getUserFriend } from "./data-access/get-user-friend";
import { FriendsContent } from "./_components/friends-content";

export default async function FrendsPage() {
  const friends = await getUserFriend();
  return <FriendsContent data={friends} />
}