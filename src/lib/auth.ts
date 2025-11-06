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

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
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
    },
    async signOut(message) {
      console.log(`[LOGOUT]`, message);
    }
  },
  pages: {
    signIn: "/auth/signin"
  }
});
