import type { Subscription } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      tenantId?: string;
      role?: string;
      subscription?: Subscription | null;
    };
  }
}
