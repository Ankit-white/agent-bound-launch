import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";

const stats = [
  { value: 100, suffix: "+", label: "Early Access Signups" },
  { value: 6, suffix: "", label: "Agent Import Methods" },
  { value: 12, suffix: "+", label: "Built-in Tools" },
  { value: 100, suffix: "%", label: "Bring Your Own AI" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setN(value);
      return;
    }
    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const dur = 1400;
        const tick = (t: number) => {
          const p = Math.min((t - start) / dur, 1);
          setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="border-y border-border px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.07} className="min-w-0 text-center lg:text-left">
            <div className="font-display text-4xl tracking-tight sm:text-5xl lg:text-6xl">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <p className="mt-3 text-xs tracking-[0.14em] text-muted-foreground uppercase sm:text-sm">
              {s.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
