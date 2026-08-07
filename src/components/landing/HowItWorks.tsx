import { Reveal } from "./Reveal";

const steps = [
  { n: "01", title: "Create or Import Agent", desc: "Start native, or bring an n8n workflow, GitHub repository or ZIP package." },
  { n: "02", title: "Connect AI Provider", desc: "Attach your own keys or point BitBoundPay at a local runtime." },
  { n: "03", title: "Deploy", desc: "Ship the agent to the execution engine in one step." },
  { n: "04", title: "Chat, Automate & Scale", desc: "Run conversations, automate workflows, and grow without limits." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase">
            How it works
          </p>
          <h2 className="mt-6 font-display text-[clamp(2rem,6vw,3.75rem)] leading-[1.05] tracking-[-0.02em]">
            Four steps, <span className="italic">nothing else</span>.
          </h2>
        </Reveal>

        <ol className="mt-14 border-l border-border">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <li className="relative grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 pb-12 pl-6 last:pb-0 sm:gap-x-8 sm:pl-10">
                <span
                  aria-hidden
                  className="absolute top-2 -left-[5px] h-2.5 w-2.5 rounded-full bg-primary"
                />
                <span className="font-mono text-sm text-primary">{s.n}</span>
                <div className="min-w-0">
                  <h3 className="text-xl font-medium tracking-tight sm:text-2xl">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {s.desc}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
