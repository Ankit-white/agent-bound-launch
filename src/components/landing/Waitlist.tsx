import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "./Reveal";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100, "Name is too long"),
  email: z.string().trim().email("Enter a valid email address").max(255, "Email is too long"),
  building: z.string().trim().max(1000, "Please keep this under 1000 characters"),
});

export function Waitlist() {
  const [form, setForm] = useState({ name: "", email: "", building: "" });
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setError(null);
    setStatus("loading");
    const { error: dbError } = await supabase.from("waitlist_signups").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      building: parsed.data.building || null,
    });
    if (dbError) {
      setStatus("idle");
      setError("Something went wrong. Please try again.");
      return;
    }
    setStatus("done");
  };

  const field =
    "w-full rounded-xl border border-border bg-surface px-4 py-4 text-base text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-ring";

  return (
    <section id="waitlist" className="relative overflow-hidden border-t border-border px-5 py-24 sm:px-8 sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-40%] left-1/2 h-[420px] w-[min(900px,120vw)] -translate-x-1/2 rounded-[50%] opacity-20 blur-[120px]"
        style={{ background: "var(--gradient-accent)" }}
      />
      <div className="relative mx-auto max-w-2xl">
        <Reveal>
          <h2 className="text-center font-display text-[clamp(2.25rem,8vw,4.5rem)] leading-[1.02] tracking-[-0.02em] text-balance">
            Join <span className="text-gradient italic">Early Access</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-center text-base leading-relaxed text-muted-foreground">
            Be among the first to build on the AI Agent Operating System.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          {status === "done" ? (
            <div className="surface-card mt-12 rounded-2xl px-6 py-14 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Check className="h-6 w-6" aria-hidden />
              </span>
              <p className="mt-6 font-display text-3xl tracking-tight">You're on the waitlist.</p>
              <p className="mt-3 text-sm text-muted-foreground">
                We'll notify you when BitBoundPay launches.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-12 space-y-4" noValidate>
              <div>
                <label htmlFor="name" className="mb-2 block text-sm text-muted-foreground">
                  Name <span className="text-primary">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={field}
                  placeholder="Ada Lovelace"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm text-muted-foreground">
                  Email <span className="text-primary">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={field}
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label htmlFor="building" className="mb-2 block text-sm text-muted-foreground">
                  What are you building? <span className="opacity-60">(optional)</span>
                </label>
                <textarea
                  id="building"
                  name="building"
                  rows={4}
                  value={form.building}
                  onChange={(e) => setForm({ ...form, building: e.target.value })}
                  className={`${field} resize-none`}
                  placeholder="A support agent that reads our docs..."
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-5 text-base font-medium text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-70"
              >
                {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                Join Early Access
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
