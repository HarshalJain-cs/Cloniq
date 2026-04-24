import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Features from "@/components/home/Features";
import WhyCloniq from "@/components/home/WhyCloniq";
import AgentGrid from "@/components/home/AgentGrid";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <HowItWorks />
      <Features />
      <WhyCloniq />
      <AgentGrid />
    </div>
  );
}
