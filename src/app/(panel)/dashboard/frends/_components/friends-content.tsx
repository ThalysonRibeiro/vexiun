"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FriendList } from "./friendList";
import { UserSearch } from "../../_components/utility-action-dashboard/user-search";

type Friends = {
  accepted: FriendsType[];
  pending: FriendsType[];
  error?: undefined;
} | {
  accepted: FriendsType[];
  pending: FriendsType[];
  error: unknown;
}
export type FriendsType = {
  friendshipId: string;
  user: {
    image: string | null;
    id: string;
    name: string | null;
    email: string;
  };
  isRequester: boolean;
  createdAt: Date;
};

type TabKey = "accepted" | "pending";

export function FriendsContent({ data: friends }: { data: Friends }) {
  const [activeTab, setActiveTab] = useState<TabKey | string>("accepted");

  const tabsConfig = [
    {
      key: "accepted",
      label: "Amigos",
      component: <FriendList data={friends.accepted} requestType="accepted" />
    },
    {
      key: "pending",
      label: "Pendentes",
      component: <FriendList data={friends.pending} requestType="pending" />
    },
    {
      key: "add-friend",
      label: "Adicionar amigo",
      component: <div className="px-6 space-y-4 text-center text-zinc-500"><UserSearch /></div>
    }
  ];

  return (
    <main className="container mx-auto p-6 max-w-7xl mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Amigos</CardTitle>
          <CardDescription>Veja seus amigos</CardDescription>
          <ul className="inline-flex gap-4">
            {tabsConfig.map(tab => (
              <li key={tab.key}>
                <Button
                  size={"sm"}
                  onClick={() => setActiveTab(tab.key)}
                  variant={activeTab === tab.key ? "default" : "outline"}
                >
                  {tab.label}
                </Button>
              </li>
            ))}
          </ul>
        </CardHeader>
        {tabsConfig.find(tab => tab.key === activeTab)?.component}
      </Card>
    </main>
  )
}

