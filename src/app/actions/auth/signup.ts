"use server";

import {
  DuplicateError,
  ERROR_MESSAGES,
  successResponse,
  ValidationError,
  withErrorHandler
} from "@/lib/errors";
import { SignUpFormData, signUpSchema } from "./auth-schema";
import prisma from "@/lib/prisma";
import { saltAndHashPassword } from "@/utils/salt-and-hash-password";

export const handleSignUp = withErrorHandler(async (formData: SignUpFormData) => {
  const schema = signUpSchema.safeParse(formData);
  if (!schema.success) {
    throw new ValidationError(schema.error.issues[0].message);
  }

  const results = await prisma.$transaction(async (tx) => {
    const existingEmail = await tx.user.findUnique({
      where: { email: formData.email }
    });

    if (existingEmail) {
      throw new DuplicateError(ERROR_MESSAGES.DUPLICATE.EMAIL);
    }
    const passwordHash = await saltAndHashPassword(formData.password);

    const newUser = await tx.user.create({
      data: {
        name: formData.name,
        email: formData.email,
        passwordHash
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    await tx.userSettings.create({
      data: {
        userId: newUser.id
      }
    });
  });

  return successResponse(results);
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);
