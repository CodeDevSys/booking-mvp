"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#product", label: "Product" },
  { href: "#pricing", label: "Pricing" },
  { href: "#trust", label: "Security" },
];

export function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-nexora-border/40 bg-nexora-bg/80 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-nexora-blue to-nexora-purple text-sm font-bold text-white">
            N
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">NEXORA</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-nexora-muted transition hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <Link
              href="/dashboard"
              className="rounded-lg border border-nexora-border px-4 py-2 text-sm text-white transition hover:border-nexora-blue"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-sm text-nexora-muted transition hover:text-white"
            >
              Log in
            </Link>
          )}
          <Link
            href="/register"
            className="rounded-lg bg-gradient-to-r from-nexora-blue to-nexora-purple px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 glow-blue"
          >
            Start Free Trial
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden rounded-lg border border-nexora-border p-2 text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-nexora-border/40 bg-nexora-surface px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block text-nexora-muted"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/register" className="block font-medium text-nexora-cyan">
                Start Free Trial
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
