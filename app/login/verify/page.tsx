import Link from "next/link";

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-nexora-bg">
      <div className="glass max-w-md rounded-2xl p-8 text-center">
        <h1 className="text-xl font-bold text-white">Verify your email</h1>
        <p className="mt-3 text-sm text-nexora-muted">
          A sign-in link has been sent to your email address. Click the link to access
          your dashboard.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm text-nexora-cyan hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
