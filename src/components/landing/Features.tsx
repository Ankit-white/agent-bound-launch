import {
  Boxes,
  Brain,
  Cpu,
  CreditCard,
  Database,
  FileArchive,
  Github,
  Library,
  Plug,
  Route,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Reveal } from "./Reveal";

const features = [
  { icon: Sparkles, title: "Native AI Agents", desc: "Create agents directly inside BBP." },
  { icon: Workflow, title: "n8n Integration", desc: "Import workflows instantly." },
  { icon: Github, title: "GitHub Import", desc: "Deploy directly from repositories." },
  { icon: FileArchive, title: "ZIP Import", desc: "Upload packaged agents." },
  { icon: Cpu, title: "Local AI", desc: "Hermes, Ollama, ComfyUI, LM Studio." },
  { icon: Plug, title: "Bring Your Own AI", desc: "OpenAI, OpenRouter, Anthropic, Gemini, Groq." },
  { icon: Brain, title: "Memory Engine", desc: "Persistent AI memory." },
  { icon: Boxes, title: "Execution Engine", desc: "Reliable AI execution." },
  { icon: Database, title: "Knowledge Base", desc: "Documents and context." },
  { icon: Route, title: "Planner", desc: "Automatic tool planning." },
  { icon: Library, title: "Tool Registry", desc: "Extensible tools." },
  { icon: CreditCard, title: "Payments", desc: "Built-in payment workflows." },
];

export function Features() {
  return (
    <section id="features" className="border-t border-border px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase">Features</p>
          <h2 className="mt-6 max-w-2xl font-display text-[clamp(2rem,6vw,3.75rem)] leading-[1.05] tracking-[-0.02em]">
            Everything an agent needs to <span className="italic">ship</span>.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={Math.min(i, 6) * 0.04}>
              <article className="group h-full bg-card p-7 transition-colors duration-300 hover:bg-surface sm:p-8">
                <f.icon
                  className="h-5 w-5 text-primary transition-transform duration-300 group-hover:-translate-y-0.5"
                  aria-hidden
                />
                <h3 className="mt-6 text-lg font-medium tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
