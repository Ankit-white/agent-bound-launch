import { motion } from "motion/react";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[92svh] items-center overflow-hidden px-5 pt-28 pb-20 sm:px-8 sm:pt-36"
    >
      <svg
        aria-hidden
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full text-primary/20 [mask-image:radial-gradient(75%_65%_at_50%_45%,black,transparent)]"
      >
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <polygon points="600,40 1130,400 600,760 70,400" />
          <polygon points="600,140 980,400 600,660 220,400" />
          <path d="M70 400H1130M600 40V760M220 400 600 140 980 400 600 660Z" />
          <path d="M70 400 600 140M1130 400 600 140M70 400 600 660M1130 400 600 660" />
        </g>
      </svg>


      <div className="relative mx-auto w-full max-w-5xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[0.7rem] font-medium tracking-[0.22em] text-muted-foreground uppercase"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Early Access
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 font-display text-[clamp(2.75rem,11vw,7.5rem)] leading-[0.95] tracking-[-0.02em] text-balance"
        >
          The AI Agent
          <br />
          <span className="text-primary italic">Operating System</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg"
        >
          Build, import, deploy and manage AI agents from one unified platform. Bring your own AI
          provider, connect n8n workflows, import GitHub repositories, upload ZIP packages or
          integrate local AI runtimes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-10 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center"
        >
          <a
            href="#waitlist"
            className="inline-flex h-13 items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5"
          >
            Join Waitlist
          </a>
          <a
            href="#vision"
            className="inline-flex h-13 items-center justify-center rounded-full border border-border bg-surface px-8 py-4 text-base font-medium text-foreground transition-colors hover:bg-muted"
          >
            Read Vision
          </a>
        </motion.div>
      </div>
    </section>
  );
}
