"use server";

import { signIn } from "@/lib/auth";

export type SigInType = "github" | "google";

export async function handleRegister(provider: SigInType) {
  await signIn(provider, {
    redirectTo: "/dashboard",
    callbackUrl: "/dashboard"
  });
}
