import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { ProgressGoals } from "./goals/_components/summary";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { LoginAlert } from "@/components/login-alert";
import { Priorities } from "./_components/priorities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getDetailUser } from "@/app/data-access/user";
import { getMyWorkspaces } from "@/app/data-access/workspace/get-my-workspace";
import { getWeekSummary } from "@/app/data-access/goals";
import { unwrapServerData } from "@/utils/server-helpers";
import { DialogCreateWorkspace } from "./workspace/[id]/_components/dialog-create-workspace";
import { getSharedWorkspaces } from "@/app/data-access/workspace/get-shared-workspaces";
import { BadgeWorkspace } from "@/components/badge-workspace";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    redirect('/')
  }

  const workspaces = await getMyWorkspaces().then(unwrapServerData);
  const sharedWorkspaces = await getSharedWorkspaces().then(unwrapServerData);
  const weekSummaryDate = await getWeekSummary(session?.user?.id as string).then(unwrapServerData);
  const detailUser = await getDetailUser().then(unwrapServerData);
  if (!detailUser) { return null; };
  if (!weekSummaryDate?.summary) { return null; };
  if (!workspaces) { return null; };

  return (
    <>
      <LoginAlert emailNotifications={detailUser?.userSettings?.emailNotifications} />
      <main className="container mx-auto px-6 pt-10">
        <section className="flex flex-col space-y-4">
          <div>
            <h1 className="text-2xl font-semibold">Bem vindo de volta!</h1>
            <h2>Aqui está seu resumo.</h2>
          </div>
          {weekSummaryDate?.summary?.total > 0 ? (
            <div className="w-full space-y-4">
              <h3>Progresso das suas metas</h3>
              <ProgressGoals
                total={weekSummaryDate?.summary?.total}
                completed={weekSummaryDate?.summary?.completed}
              />
            </div>
          ) : (
            <p>Cadastre metas e acompanhe sua evolução</p>
          )}
          <Separator />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-5">
            <div className="hidden">
              <DialogCreateWorkspace
                isNoWorkspace={workspaces.length === 0 ? true : false} />
            </div>
            {sharedWorkspaces.map(shared => (
              <Link
                href={`/dashboard/workspace/${shared.workspaceId}`}
                key={shared.workspaceId}
              >
                <Card className="hover:border-primary/50 hover:bg-primary/20 transition-all duration-300 ease-in-out">
                  <CardHeader className="p-2">
                    <CardTitle>{shared.workspace.title}</CardTitle>
                    <CardDescription className="flex flex-col gap-2">
                      Última atividade {formatDistanceToNow(
                        new Date(shared.workspace.lastActivityAt),
                        { addSuffix: true, locale: ptBR }
                      )}
                      <BadgeWorkspace role={shared.role} />
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto w-full p-2">
                    {shared.workspace.members.length > 0 && (
                      <div className="flex relative">
                        {shared.workspace.members.slice(0, 6).map((member, index) => (
                          <Avatar key={member.user.id} className={cn("absolute",
                            index === 0 && "left-0",
                            index === 1 && "left-5",
                            index === 2 && "left-10",
                            index === 3 && "left-15",
                            index === 4 && "left-20",
                            index === 5 && "left-25",
                          )}>
                            <AvatarImage src={member.user.image as string} />
                            <AvatarFallback>
                              {member.user.name?.charAt(0) ?? "N"}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {shared.workspace.members.length > 6 && (
                          <span className="ml-2 flex gap-1">
                            +{shared.workspace.members.length}
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="mt-auto w-full p-2">
                    <Priorities workspaceId={shared.workspace.id} />
                  </CardFooter>
                </Card>
              </Link>
            ))}
            {/* {workspaces.map(workspace => (
              <Link
                href={`/dashboard/workspace/${workspace.id}`}
                key={workspace.id}
              >
                <Card className="hover:border-primary/50 hover:bg-primary/20 transition-all duration-300 ease-in-out">
                  <CardHeader className="p-2">
                    <CardTitle>{workspace.title}</CardTitle>
                    <CardDescription>
                      Total grupos: {workspace.groupsCount}
                      <br />
                      Total tarefas: {workspace.itemsCount}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto w-full p-2">
                    {workspace.members.length > 0 && (
                      <div className="flex relative">
                        {workspace.members.slice(0, 6).map((member, index) => (
                          <Avatar key={member.id} className={cn("absolute",
                            index === 0 && "left-0",
                            index === 1 && "left-5",
                            index === 2 && "left-10",
                            index === 3 && "left-15",
                            index === 4 && "left-20",
                            index === 5 && "left-25",
                          )}>
                            <AvatarImage src={member.image as string} />
                            <AvatarFallback>
                              {member.name?.charAt(0) ?? "N"}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {workspace.members.length > 6 && (
                          <span className="ml-2 flex gap-1">
                            +{workspace.members.length}
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="mt-auto w-full p-2">
                    <Priorities workspaceId={workspace.id} />
                  </CardFooter>
                </Card>
              </Link>
            ))} */}
          </div>
        </section>
      </main>
    </>
  )
}