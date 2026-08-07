import { Blocks, Brain, Download, Globe, Key, Layers, Server, Store } from "lucide-react";
import { Reveal } from "./Reveal";

const reasons = [
  { icon: Layers, title: "One Platform", desc: "Unlimited possibilities." },
  { icon: Key, title: "No Vendor Lock-in", desc: "Your stack stays yours." },
  { icon: Globe, title: "Bring Your Own AI", desc: "Any provider, any key." },
  { icon: Download, title: "Import Existing Agents", desc: "Nothing gets rebuilt." },
  { icon: Brain, title: "Persistent Memory", desc: "Context that survives." },
  { icon: Server, title: "Execution Engine", desc: "Deterministic runs." },
  { icon: Blocks, title: "Knowledge Base", desc: "Grounded in your docs." },
  { icon: Store, title: "Future Marketplace", desc: "Publish and discover." },
];

export function Why() {
  return (
    <section className="border-t border-border px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase">
            Why BitBoundPay
          </p>
          <h2 className="mt-6 max-w-2xl font-display text-[clamp(2rem,6vw,3.75rem)] leading-[1.05] tracking-[-0.02em]">
            Built to stay <span className="italic">open</span>.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-px sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={Math.min(i, 6) * 0.04}>
              <div className="flex min-w-0 items-start gap-4 border-t border-border py-7">
                <r.icon className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden />
                <div className="min-w-0">
                  <h3 className="text-base font-medium tracking-tight">{r.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
