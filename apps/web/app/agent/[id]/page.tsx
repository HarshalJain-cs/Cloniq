import { createServiceRoleClient } from "@/lib/supabase";
import AgentProfileDetails from "@/components/agent/AgentProfileDetails";
import ChatInterface from "@/components/agent/ChatInterface";
import { notFound } from "next/navigation";

export default async function AgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceRoleClient();

  const { data: agent, error } = await supabase
    .from("agents")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !agent) {
    return notFound();
  }

  const mappedAgent = {
    id: agent.id,
    name: agent.name,
    handle: agent.ens_name ? `@${agent.ens_name}` : `@${agent.name}.agent`,
    description: agent.description,
    status: agent.status === "active" ? "Active" : "Inactive",
    image: agent.image_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.name}`,
    walletAddress: agent.wallet_address,
    isFree: agent.is_free,
    priceUsdc: agent.price_usdc,
    queryCount: agent.query_count ?? 0,
    skillTags: agent.skill_tags ?? [],
  };

  return (
    <div className="min-h-screen pt-24 pb-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 px-6">
        {/* Left Column: Agent Details - Separate Scrolling */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:overscroll-contain scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
          <AgentProfileDetails agent={mappedAgent} />
        </div>

        {/* Right Column: Chat - Separate Scrolling */}
        <div className="lg:col-span-7 lg:min-h-[calc(100vh-8rem)]">
          <ChatInterface
            agentId={mappedAgent.id}
            agentName={mappedAgent.name}
            priceUsdc={mappedAgent.priceUsdc}
            isFree={mappedAgent.isFree}
          />
        </div>
      </div>
    </div>
  );
}
