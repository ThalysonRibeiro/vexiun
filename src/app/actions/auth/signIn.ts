"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export type SigInType = "github" | "google" | "credentials";

export async function handleSignin(provider: SigInType) {
  return await signIn(provider, {
    redirectTo: "/dashboard",
    callbackUrl: "/dashboard"
  });
}

export async function handleCredentialsSignIn(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    return { success: true, error: null };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        error: "Email ou senha inválidos"
      };
    }
    return {
      success: false,
      error: "Erro ao fazer login"
    };
  }
}
