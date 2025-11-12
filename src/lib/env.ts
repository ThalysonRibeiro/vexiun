// lib/env.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /*
   * Server-side env vars (nunca exposto pro cliente)
   */
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

    // Database
    DATABASE_URL: z.string().min(1),
    DIRECT_URL: z.string().min(1).optional(),

    // Auth
    AUTH_SECRET: z.string().min(32),

    AUTH_GOOGLE_ID: z.string().optional(),
    AUTH_GOOGLE_SECRET: z.string().optional(),
    AUTH_GITHUB_ID: z.string().optional(),
    AUTH_GITHUB_SECRET: z.string().optional(),

    // Cloudinary
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),

    // Resend
    RESEND_API_KEY: z.string().startsWith("re_"),
    RESEND_FROM_EMAIL: z.string(),
    INTERNAL_API_SECRET: z.string().min(32),
    CRON_SECRET: z.string().min(32)
  },

  /*
   * Client-side env vars (exposto pro browser)
   * PRECISA começar com NEXT_PUBLIC_
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_APP_NAME: z.string().default("Vexiun"),
    NEXT_PUBLIC_TWITTER_HANDLE: z.string().default("@vexiun_"),
    NEXT_PUBLIC_GITHUB_ORG: z.string().default("vexiun")
  },

  /*
   * Valores de process.env que queremos validar
   */
  runtimeEnv: {
    // Server
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_ID,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    INTERNAL_API_SECRET: process.env.INTERNAL_API_SECRET,
    CRON_SECRET: process.env.CRON_SECRET,

    // Client
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_TWITTER_HANDLE: process.env.NEXT_PUBLIC_TWITTER_HANDLE,
    NEXT_PUBLIC_GITHUB_ORG: process.env.NEXT_PUBLIC_GITHUB_ORG
  },

  /*
   * Pula validação em build no Vercel (já validou local)
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION
});
