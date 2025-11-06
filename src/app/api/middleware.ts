import { Role } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Mapeamento de rotas e roles permitidas
const ROUTE_PERMISSIONS: Record<string, Role[]> = {
  "/admin": [Role.ADMIN, Role.SUPER_ADMIN],
  "/super": [Role.SUPER_ADMIN]
};

export default auth((req) => {
  const { nextUrl } = req;
  const user = req.auth?.user;

  // Se não estiver autenticado, redireciona para login
  if (!user) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Verifica permissões de acesso
  const currentPath = nextUrl.pathname;

  for (const [route, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (currentPath.startsWith(route)) {
      if (!allowedRoles.includes(user.role)) {
        console.warn(
          `[AUTH] Acesso negado: ${user.email} (${user.role}) tentou acessar ${currentPath}`
        );
        return NextResponse.redirect(new URL("/", req.url)); // Redireciona para home
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/super/:path*"]
};
