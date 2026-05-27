import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-nexora-border/40 bg-nexora-surface/50 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-nexora-blue to-nexora-purple text-sm font-bold text-white">
                N
              </span>
              <span className="text-lg font-semibold text-white">NEXORA</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-nexora-muted">
              AI-powered scheduling and automation for modern businesses. GDPR-compliant
              SaaS built in Germany and the EU.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Product</h4>
            <ul className="mt-4 space-y-2 text-sm text-nexora-muted">
              <li>
                <a href="#product" className="hover:text-white transition">
                  Scheduling
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition">
                  Pricing
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Log in
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Legal (Germany)</h4>
            <ul className="mt-4 space-y-2 text-sm text-nexora-muted">
              <li>
                <Link href="/impressum" className="hover:text-white transition">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="hover:text-white transition">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/agb" className="hover:text-white transition">
                  AGB
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-nexora-border/40 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-nexora-muted">
            © {new Date().getFullYear()} NEXORA GmbH. All rights reserved.
          </p>
          <p className="text-xs text-nexora-muted max-w-xl">
            GDPR compliance notice: We process personal data in accordance with the EU
            General Data Protection Regulation (GDPR) and applicable German data
            protection law (BDSG). See our Datenschutzerklärung for details.
          </p>
        </div>
      </div>
    </footer>
  );
}
