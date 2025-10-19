import { Role } from "@/generated/prisma/client";
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const user = req.auth?.user

  const isAdminRoute = nextUrl.pathname.startsWith("/admin")
  const isSuperAdminRoute = nextUrl.pathname.startsWith("/super")

  if (isAdminRoute) {
    if (user?.role !== Role.ADMIN && user?.role !== Role.SUPER_ADMIN) {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
  }

  if (isSuperAdminRoute) {
    if (user?.role !== Role.SUPER_ADMIN) {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/super/:path*"],
}
