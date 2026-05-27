import Link from "next/link";
import type { ReactNode } from "react";

export function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-nexora-bg">
      <header className="border-b border-nexora-border/40">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <Link href="/" className="text-nexora-cyan text-sm hover:underline">
            ← NEXORA
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-white">{title}</h1>
        </div>
      </header>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 prose prose-invert prose-slate max-w-none">
        <div className="text-nexora-muted space-y-4 text-sm leading-relaxed [&_h2]:text-white [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-8 [&_h3]:text-white [&_h3]:mt-4">
          {children}
        </div>
      </article>
    </div>
  );
}
