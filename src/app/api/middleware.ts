import { Role, WorkspaceRole } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export default auth(async (req) => {
  const { nextUrl } = req;
  const user = req.auth?.user;

  // 1️⃣ Protege rotas admin globais
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isSuperAdminRoute = nextUrl.pathname.startsWith("/super");

  if (isAdminRoute) {
    if (user?.role !== Role.ADMIN && user?.role !== Role.SUPER_ADMIN) {
      console.warn(`[SECURITY] Acesso admin negado: ${user?.email}`);
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }
  if (isSuperAdminRoute) {
    if (user?.role !== Role.SUPER_ADMIN) {
      console.warn(`[SECURITY] Acesso super admin negado: ${user?.email}`);
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }
  // 2️⃣ Protege rotas de workspace (members, settings, etc)
  const workspaceRouteMatch = nextUrl.pathname.match(
    /^\/dashboard\/workspace\/([^\/]+)\/(members|settings|billing)/
  );

  if (workspaceRouteMatch && user) {
    const workspaceId = workspaceRouteMatch[1];
    const section = workspaceRouteMatch[2];

    try {
      const member = await prisma.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId,
            userId: user.id
          }
        },
        select: {
          role: true,
          user: {
            select: { role: true }
          }
        }
      });
      // Se não é membro do workspace
      if (!member) {
        console.warn(`[SECURITY] Não-membro tentou acessar: ${user.email} → ${workspaceId}`);
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
      if (member.user.role === Role.SUPER_ADMIN) {
        return NextResponse.next();
      }
      // Regras específicas por seção
      const roleHierarchy: Record<WorkspaceRole, number> = {
        VIEWER: 0,
        MEMBER: 1,
        ADMIN: 2,
        OWNER: 3
      };
      // Members e Settings precisam de ADMIN+
      if (section === "members" || section === "settings") {
        if (roleHierarchy[member.role] < roleHierarchy.ADMIN) {
          console.warn(
            `[SECURITY] Permissão insuficiente: ${user.email} (${member.role}) → ${section}`
          );
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
      }
      // Billing precisa de OWNER
      if (section === "billing") {
        if (member.role !== WorkspaceRole.OWNER) {
          console.warn(`[SECURITY] Apenas OWNER: ${user.email} (${member.role}) → billing`);
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
      }
    } catch (error) {
      console.error("[MIDDLEWARE] Erro ao validar acesso:", error);
      return NextResponse.redirect(new URL("/error", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/super/:path*",
    "/dashboard/workspace/:workspaceId/members/:path*",
    "/dashboard/workspace/:workspaceId/settings/:path*",
    "/dashboard/workspace/:workspaceId/billing/:path*"
  ]
};
