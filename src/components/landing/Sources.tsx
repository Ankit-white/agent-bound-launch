import { Cloud, Cpu, FileArchive, Github, Sparkles, Workflow } from "lucide-react";
import { Reveal } from "./Reveal";

const sources = [
  { icon: Sparkles, title: "Native BitBoundPay Agent", desc: "Composed inside the platform." },
  { icon: Workflow, title: "n8n Workflow", desc: "Your automation, now an agent." },
  { icon: Github, title: "GitHub Repository", desc: "Deploy straight from source." },
  { icon: FileArchive, title: "ZIP Package", desc: "Upload and run in seconds." },
  { icon: Cpu, title: "Local AI Services", desc: "Hermes, Ollama, ComfyUI, LM Studio." },
  { icon: Cloud, title: "Remote API", desc: "Coming soon.", soon: true },
];

export function Sources() {
  return (
    <section className="border-t border-border px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase">
            Supported agent sources
          </p>
          <h2 className="mt-6 max-w-2xl font-display text-[clamp(2rem,6vw,3.75rem)] leading-[1.05] tracking-[-0.02em]">
            Six ways in. <span className="italic">No lock-in.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((s, i) => (
            <Reveal key={s.title} delay={Math.min(i, 5) * 0.05}>
              <article className="surface-card group h-full rounded-2xl p-7 transition-transform duration-300 hover:-translate-y-1 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <s.icon className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                  {s.soon && (
                    <span className="shrink-0 rounded-full border border-border px-3 py-1 text-[0.62rem] tracking-[0.16em] text-muted-foreground uppercase">
                      Soon
                    </span>
                  )}
                </div>
                <h3 className="mt-8 text-lg font-medium tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
