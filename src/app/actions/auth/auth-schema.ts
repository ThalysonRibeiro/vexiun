import { ERROR_MESSAGES } from "@/lib/errors";
import { isValidEmail } from "@/utils/emailValidation";
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, ERROR_MESSAGES.PASSWORD.MIN)
  .max(100, ERROR_MESSAGES.PASSWORD.MAX)
  .regex(/[A-Z]/, ERROR_MESSAGES.PASSWORD.UPPERCASE)
  .regex(/[a-z]/, ERROR_MESSAGES.PASSWORD.LOWERCASE)
  .regex(/[0-9]/, ERROR_MESSAGES.PASSWORD.NUMBER)
  .regex(/[^a-zA-Z0-9]/, ERROR_MESSAGES.PASSWORD.SPECIAL);

export const signInSchema = z.object({
  email: z
    .string()
    .email(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL)
    .refine(isValidEmail, ERROR_MESSAGES.VALIDATION.INVALID_EMAIL),
  password: passwordSchema
});

export const signUpSchema = signInSchema
  .extend({
    name: z
      .string()
      .min(3, ERROR_MESSAGES.VALIDATION.MIN_LENGTH)
      .max(100, ERROR_MESSAGES.VALIDATION.MAX_LENGTH),
    confirmPassword: passwordSchema
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"]
  });

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
