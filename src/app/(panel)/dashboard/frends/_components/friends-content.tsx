"use client"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { FriendList } from "./friendList";
import { SendFrendshipRequest } from "../../_components/utility-action-dashboard/send-frendship-request";
import { useMyFrendse } from "@/hooks/use-friendship";
import { cn } from "@/lib/utils";


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

export function FriendsContent() {
  const [activeTab, setActiveTab] = useState<TabKey | string>("accepted");
  const { data, isLoading, isError, } = useMyFrendse();

  const excludeUserIds = useMemo(() => {
    return data?.accepted.map(friend => friend.user.id);
  }, [data]);

  const tabsConfig = [
    {
      key: "accepted",
      label: "Amigos",
      component: <FriendList data={data?.accepted ?? []} requestType="accepted" />,
      isShown: data?.accepted?.length as number > 0
    },
    {
      key: "pending",
      label: "Pendentes",
      component: <FriendList data={data?.pending ?? []} requestType="pending" />,
      isShown: data?.pending?.length as number > 0
    },
    {
      key: "add-friend",
      label: "Adicionar amigo",
      component: <div className="px-6 space-y-4 text-center text-zinc-500">
        <SendFrendshipRequest excludeUserIds={excludeUserIds} />
      </div>,
      isShown: true
    }
  ];

  if (isLoading) {
    return <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-4 border-t-accent rounded-full animate-spin border-primary">
    </div>
  }

  return (
    <main className="container mx-auto p-6 max-w-7xl mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Amigos</CardTitle>
          <CardDescription>Veja seus amigos</CardDescription>
          <ul className={cn("inline-flex gap-2",
            data?.pending?.length as number > 0 && "gap-4"
          )}>
            {tabsConfig.map(tab => (
              <li key={tab.key}>
                {tab.isShown && (
                  <Button
                    size={"sm"}
                    onClick={() => setActiveTab(tab.key)}
                    variant={activeTab === tab.key ? "default" : "outline"}
                  >
                    {tab.label}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </CardHeader>
        {tabsConfig.find(tab => tab.key === activeTab)?.component}
      </Card>
    </main>
  )
}

