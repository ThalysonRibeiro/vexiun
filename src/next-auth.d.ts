import { Role } from '@/generated/prisma/client';
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      role: Role;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: Role;
  }
}
