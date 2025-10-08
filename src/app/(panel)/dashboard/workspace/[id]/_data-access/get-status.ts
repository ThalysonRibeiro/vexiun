import prisma from "@/lib/prisma";
import { Status } from "@/generated/prisma";

export type StatusCount = {
  status: Status;
  count: number;
};

export async function getStatus(
  workspaceId: string
): Promise<StatusCount[]> {
  const items = await prisma.item.findMany({
    where: {
      group: {
        workspaceId: workspaceId,
      },
    },
    select: {
      status: true,
    },
    orderBy: {
      status: "asc",
    },
  });

  const statusCount = items.reduce((acc, item) => {
    const status = item.status;
    const existingStatus = acc.find((p) => p.status === status);

    if (existingStatus) {
      existingStatus.count++;
    } else {
      acc.push({ status, count: 1 });
    }

    return acc;
  }, [] as StatusCount[]);

  return statusCount;
}
