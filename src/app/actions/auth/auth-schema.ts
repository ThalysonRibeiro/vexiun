import { ERROR_MESSAGES } from "@/lib/errors";
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "A senha deve ter no mínimo 8 caracteres")
  .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
  .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
  .regex(/[0-9]/, "A senha deve conter pelo menos um número")
  .regex(/[^a-zA-Z0-9]/, "A senha deve conter pelo menos um caractere especial");

export const signInSchema = z.object({
  email: z.string().email(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL),
  password: passwordSchema
});

export const signUpSchema = signInSchema.extend({
  name: z
    .string()
    .min(3, ERROR_MESSAGES.VALIDATION.MIN_LENGTH)
    .max(100, ERROR_MESSAGES.VALIDATION.MAX_LENGTH),
  confirmPassword: passwordSchema
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
