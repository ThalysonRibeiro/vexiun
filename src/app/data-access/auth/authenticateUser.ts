"use server";

import { Role } from "@/generated/prisma";
import { ERROR_MESSAGES, NotFoundError } from "@/lib/errors";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/utils/salt-and-hash-password";

export async function authenticateUser(
  email: string,
  password: string
): Promise<{
  id: string;
  email: string;
  name: string | null;
  passwordHash: string | null;
  image: string | null;
  role: Role;
}> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      image: true,
      email: true,
      passwordHash: true,
      role: true
    }
  });

  if (!user) {
    throw new NotFoundError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  const valid = await verifyPassword(password, user.passwordHash as string);

  if (!valid) {
    throw new NotFoundError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
  }
  return user;
}
