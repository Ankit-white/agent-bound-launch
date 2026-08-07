import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Check, MessageCircle, Twitter } from "lucide-react";
import { Footer } from "@/components/landing/Footer";
import { Nav } from "@/components/landing/Nav";

export const Route = createFileRoute("/waitlist-success")({
  head: () => ({
    meta: [
      { title: "You're on the waitlist | BitBoundPay" },
      {
        name: "description",
        content: "Your email has been verified and your BitBoundPay waitlist entry is active.",
      },
    ],
  }),
  component: WaitlistSuccess,
});

function WaitlistSuccess() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="grid-lines relative flex min-h-[calc(100vh-5rem)] items-center overflow-hidden border-b border-border px-5 py-28 sm:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-45%] left-1/2 h-[420px] w-[min(900px,120vw)] -translate-x-1/2 rounded-[50%] opacity-20 blur-[120px]"
          style={{ background: "var(--gradient-accent)" }}
        />
        <section className="relative mx-auto w-full max-w-2xl text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Check className="h-7 w-7" aria-hidden />
          </span>
          <h1 className="mt-7 font-display text-[clamp(2.5rem,8vw,4.5rem)] leading-[1.02] text-balance">
            <span aria-hidden>🎉 </span>You're officially on the{" "}
            <span className="text-gradient italic">waitlist.</span>
          </h1>
          <div className="mx-auto mt-6 max-w-lg space-y-2 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>Your email has been verified successfully.</p>
            <p>We'll notify you as soon as BitBoundPay launches.</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-sm gap-3">
            <a
              href="https://x.com/Bitboundpay"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <Twitter className="h-4 w-4" aria-hidden />
              Follow us on X
            </a>
            <a
              href="https://discord.gg/pZqcNZNhR"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-6 py-3 text-sm font-medium text-foreground shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Join our Discord
            </a>
            <a
              href="/"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Return to Homepage
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
