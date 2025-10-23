"use server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/errors";
import { successResponse } from "@/lib/errors/error-handler";
import { ERROR_MESSAGES } from "@/lib/errors";
import { EntityStatus } from "@/generated/prisma";

// export const getSharedWorkspaces = withAuth(
//   async (userId, session) => {

//     const data = await prisma.workspaceMember.findMany({
//       where: { userId },
//       include: {
//         workspace: {
//           select: {
//             id: true,
//             title: true,
//             description: true,
//             categories: true,
//             userId: true,
//             createdAt: true,
//             updatedAt: true,
//             lastActivityAt: true,
//             statusChangedAt: true,
//             statusChangedBy: true,
//             status: true,
//             members: {
//               select: {
//                 user: {
//                   select: {
//                     id: true,
//                     name: true,
//                     email: true,
//                     image: true,
//                   }
//                 },
//                 role: true
//               },
//             },
//             _count: {
//               select: {
//                 groups: true,
//                 members: true
//               }
//             }
//           },
//         },
//       },
//     });

//     const workspaces = data.map(d => d.workspace);
//     const groupsWithCount = await prisma.group.findMany({
//       where: { workspaceId: { in: workspaces.map(d => d.id) } },
//       select: {
//         workspaceId: true,
//         _count: { select: { item: true } }
//       }
//     });

//     const sortedData = data.sort((a, b) =>
//       b.workspace.lastActivityAt.getTime() - a.workspace.lastActivityAt.getTime()
//     );

//     const workspaceSummaries = workspaces.map((memberWithWorkspace) => {
//       const totalItems = groupsWithCount
//         .filter(g => g.workspaceId === memberWithWorkspace.id)
//         .reduce((acc, g) => acc + g._count.item, 0);

//       return {
//         id: memberWithWorkspace.id,
//         title: memberWithWorkspace.title,
//         description: memberWithWorkspace.description,
//         categories: memberWithWorkspace.categories,
//         statusChangedAt: memberWithWorkspace.statusChangedAt,
//         statusChangedBy: memberWithWorkspace.statusChangedBy,
//         lastActivityAt: memberWithWorkspace.lastActivityAt,
//         status: memberWithWorkspace.status,
//         groupsCount: memberWithWorkspace._count.groups,
//         itemsCount: totalItems,
//         userId: memberWithWorkspace.userId,
//         members: memberWithWorkspace.members.map(m => m.user),
//         menbersRole: memberWithWorkspace.members.find(m => m.user.id === userId)?.role,
//       }
//     });

//     const sharedSortedData = workspaceSummaries.sort((a, b) =>
//       b.lastActivityAt.getTime() - a.lastActivityAt.getTime()
//     );

//     return successResponse({ sortedData, sharedSortedData });
//   },
//   ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
// );

export type SharedWorkspacesResponse = Awaited<ReturnType<typeof getSharedWorkspaces>>;
export type SharedWorkspacesData = Extract<SharedWorkspacesResponse, { success: true }>['data'];

export const getSharedWorkspaces = withAuth(async (
  userId,
  session,
  includeStatus?: EntityStatus[],
  cursor?: string,
  take = 50
) => {
  const statusFilter = includeStatus || ['ACTIVE'];

  const data = await prisma.workspaceMember.findMany({
    where: {
      userId,
      workspace: { status: { in: statusFilter } }
    },
    include: {
      workspace: {
        select: {
          id: true,
          title: true,
          description: true,
          categories: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
          lastActivityAt: true,
          statusChangedAt: true,
          statusChangedBy: true,
          status: true,
          members: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                }
              },
              role: true
            },
          },
          _count: {
            select: {
              groups: true,
              members: true
            }
          }
        },
      },
    },
    take,
    ...(cursor ? { skip: 1, cursor: { workspaceId_userId: { workspaceId: cursor, userId } } } : {})
  });

  const workspaceIds = data.map(d => d.workspace.id);

  const groupsWithCount = await prisma.group.findMany({
    where: { workspaceId: { in: workspaceIds } },
    select: {
      workspaceId: true,
      _count: { select: { item: true } }
    }
  });

  // Usar 'data' diretamente, não 'workspaces'
  const workspaceSummaries = data.map((item) => {
    const workspace = item.workspace;

    const totalItems = groupsWithCount
      .filter(g => g.workspaceId === workspace.id)
      .reduce((acc, g) => acc + g._count.item, 0);

    return {
      id: workspace.id,
      title: workspace.title,
      description: workspace.description,
      categories: workspace.categories,
      statusChangedAt: workspace.statusChangedAt,
      statusChangedBy: workspace.statusChangedBy,
      lastActivityAt: workspace.lastActivityAt,
      status: workspace.status,
      groupsCount: workspace._count.groups,
      itemsCount: totalItems,
      userId: workspace.userId,
      members: workspace.members.map(m => m.user),
      menbersRole: workspace.members.find(m => m.user.id === userId)?.role,
    };
  });

  // Ordenar os workspaces transformados
  const sortedWorkspaces = workspaceSummaries.sort((a, b) =>
    b.lastActivityAt.getTime() - a.lastActivityAt.getTime()
  );

  return successResponse(sortedWorkspaces);
},
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);