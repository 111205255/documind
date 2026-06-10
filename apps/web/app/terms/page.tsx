import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-lg px-6 py-10">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Terms of use</h1>
      <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
        {APP_NAME} lets you upload documents and ask questions using AI. Your documents and
        chats are private to your account. Do not upload confidential material you are not
        allowed to process with a third-party AI service.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
        Answers include citations from your uploaded content, but you should verify important
        information before relying on it for legal, medical, or financial decisions.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
        By using {APP_NAME}, you agree to use the service responsibly and comply with
        applicable laws in your region.
      </p>
      <Link
        href="/login"
        className="mt-8 inline-block text-sm font-medium text-[var(--brand-primary)] underline-offset-2 hover:underline"
      >
        Back to sign in
      </Link>
    </main>
  );
}
