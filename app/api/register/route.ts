import { prisma } from "@/lib/prisma";
import { PlanTier } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  businessName: z.string().min(2).max(100),
  planId: z.enum(["basic", "pro", "business"]).default("pro"),
});

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) +
    "-" +
    Math.random().toString(36).slice(2, 8)
  );
}

const planTierMap: Record<string, PlanTier> = {
  basic: "BASIC",
  pro: "PRO",
  business: "BUSINESS",
};

export async function POST(request: Request) {
  try {
    const body = registerSchema.parse(await request.json());
    const { email, businessName, planId } = body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing?.tenantId) {
      return NextResponse.json(
        { error: "Account already exists. Please sign in." },
        { status: 409 }
      );
    }

    const slug = slugify(businessName);

    const tenant = await prisma.tenant.create({
      data: {
        name: businessName,
        slug,
        subscription: {
          create: {
            plan: planTierMap[planId],
            status: "TRIALING",
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          },
        },
      },
      include: { subscription: true },
    });

    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        name: businessName,
        role: "OWNER",
        tenantId: tenant.id,
      },
      update: {
        tenantId: tenant.id,
        role: "OWNER",
      },
    });

    return NextResponse.json({
      success: true,
      userId: user.id,
      tenantId: tenant.id,
      planId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    console.error("Register error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
