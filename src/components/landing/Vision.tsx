import { Reveal } from "./Reveal";

export function Vision() {
  return (
    <section id="vision" className="px-5 py-24 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase">
            What is BitBoundPay
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-6 font-display text-[clamp(2.25rem,7vw,4.5rem)] leading-[1.02] tracking-[-0.02em] text-balance">
            One platform for every agent you <span className="text-gradient italic">run</span>.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
            BitBoundPay is an AI Agent Operating System built for developers and businesses. Instead
            of locking users into one ecosystem, BitBoundPay lets them connect AI from anywhere and
            manage everything from one platform.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
