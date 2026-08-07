import { Reveal } from "./Reveal";

const phases = [
  {
    tag: "V1",
    title: "Foundation",
    items: [
      "Native Agents",
      "GitHub Import",
      "ZIP Import",
      "n8n",
      "Local AI",
      "Bring Your Own AI",
      "Execution Engine",
      "Memory Engine",
    ],
  },
  {
    tag: "V2",
    title: "Scale",
    items: [
      "Marketplace",
      "Organizations",
      "Analytics",
      "Cloud Deployments",
      "Enterprise Features",
      "Remote API Import",
    ],
  },
  {
    tag: "V3",
    title: "Operating System",
    items: [
      "Complete AI Agent Operating System",
      "Agent Economy",
      "Autonomous Multi-Agent Runtime",
      "Enterprise Ecosystem",
    ],
  },
];

export function Roadmap() {
  return (
    <section id="roadmap" className="border-t border-border px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase">Roadmap</p>
          <h2 className="mt-6 max-w-2xl font-display text-[clamp(2rem,6vw,3.75rem)] leading-[1.05] tracking-[-0.02em]">
            Where this is <span className="italic">going</span>.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
          {phases.map((p, i) => (
            <Reveal key={p.tag} delay={i * 0.08}>
              <div className="min-w-0 border-t border-border pt-8">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-4xl text-gradient">{p.tag}</span>
                  <span className="truncate text-xs tracking-[0.18em] text-muted-foreground uppercase">
                    {p.title}
                  </span>
                </div>
                <ul className="mt-7 space-y-3">
                  {p.items.map((it) => (
                    <li key={it} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span
                        aria-hidden
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary"
                      />
                      <span className="min-w-0">{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
