import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/services/email.service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (!existingUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const token =
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  // const expiresAt=new Date(Date.now() + 3600 * 1000); // 1 hour from now
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: {
      emailVerificationToken: token,
      verificationExpiresAt: expiresAt
    }
  });

  await sendVerificationEmail(email, token, existingUser.name || undefined);

  return NextResponse.json({ message: "E-mail send" });
}
