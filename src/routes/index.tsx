import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { Vision } from "@/components/landing/Vision";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Sources } from "@/components/landing/Sources";
import { Why } from "@/components/landing/Why";
import { Roadmap } from "@/components/landing/Roadmap";
import { Waitlist } from "@/components/landing/Waitlist";
import { Footer } from "@/components/landing/Footer";

const title = "BitBoundPay — The AI Agent Operating System";
const description =
  "Build, import, deploy and manage AI agents from one platform. Bring your own AI provider, n8n workflows, GitHub repos, ZIP packages or local AI. Join early access.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Vision />
        <Features />
        <HowItWorks />
        <Sources />
        <Why />
        <Roadmap />
        <Waitlist />
      </main>
      <Footer />
    </div>
  );
}
