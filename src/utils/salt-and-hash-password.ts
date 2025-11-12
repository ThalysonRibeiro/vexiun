import { env } from "@/lib/env";
import argon2 from "argon2";

const isProd = env.NODE_ENV === "production";

export async function saltAndHashPassword(password: string): Promise<string> {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: isProd ? 5 : 2,
    parallelism: 1,
    hashLength: 32
  });
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return await argon2.verify(hashed, password);
}
