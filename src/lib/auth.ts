import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import prisma from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authenticateUser } from "@/app/data-access/auth/authenticateUser";
import { ERROR_MESSAGES, ValidationError } from "./errors";
import { signInSchema } from "@/app/actions/auth";
import { Role } from "@/generated/prisma";
import { env } from "./env";

const adapter = PrismaAdapter(prisma);

const extendedAdapter: typeof adapter = {
  ...adapter,
  async createUser(data) {
    const user = await adapter.createUser!(data);

    try {
      await prisma.userSettings.create({
        data: {
          userId: user.id
        }
      });
    } catch (error) {
      console.error("Erro ao criar UserSettings:", error);
      throw new Error("Erro ao criar UserSettings");
    }

    return user;
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: extendedAdapter,
  trustHost: true,
  session: {
    strategy: "jwt"
  },
  providers: [
    GitHub,
    Google,
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com"
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****"
        }
      },
      authorize: async (credentials) => {
        const { email, password } = signInSchema.parse(credentials);
        const user = await authenticateUser(email, password);

        if (!user) {
          throw new ValidationError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
        }

        return {
          id: user.id,
          name: user.name,
          image: user.image,
          email: user.email,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    }
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(`[LOGIN] ${user.email} via ${account?.provider}${isNewUser ? " (novo)" : ""}`);
      // 🔥 Envia alerta de login de forma assíncrona (não bloqueia o login)
      setImmediate(async () => {
        try {
          // Busca as preferências do usuário
          const userSettings = await prisma.userSettings.findUnique({
            where: { userId: user.id },
            select: { emailNotifications: true }
          });

          // Só envia se as notificações estiverem ativas
          if (userSettings?.emailNotifications) {
            const loginInfo = {
              email: user.email!,
              name: user.name || "Usuário",
              provider: account?.provider || "credentials",
              timestamp: new Date().toISOString(),
              isNewUser
            };

            // Chama a API route de forma segura
            const baseUrl = env.NEXT_PUBLIC_APP_URL;

            const response = await fetch(`${baseUrl}/api/auth/login-alert`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                // 🔒 Token secreto para autenticar requisições internas
                "x-internal-secret": env.INTERNAL_API_SECRET!
              },
              body: JSON.stringify(loginInfo)
            });

            if (response.ok) {
              console.log(`✅ Alerta de login enviado para ${user.email}`);
            } else {
              console.error(`❌ Erro ao enviar alerta: ${response.status}`);
            }
          } else {
            console.log(`ℹ️ Notificações desativadas para ${user.email}`);
          }
        } catch (error) {
          console.error("❌ Erro ao enviar alerta de login:", error);
          // Não falha o login por causa disso
        }
      });
    },
    async signOut(message) {
      console.log(`[LOGOUT]`, message);
    }
  },
  pages: {
    signIn: "/auth/signin"
  }
});
