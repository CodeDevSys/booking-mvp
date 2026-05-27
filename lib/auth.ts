import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM ?? "NEXORA <noreply@nexora.app>",
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
    error: "/login",
  },
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { tenant: { include: { subscription: true } } },
        });
        if (dbUser) {
          session.user.tenantId = dbUser.tenantId ?? undefined;
          session.user.role = dbUser.role;
          session.user.subscription = dbUser.tenant?.subscription ?? null;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
