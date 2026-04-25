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
    <div className="h-screen flex flex-col pt-20 overflow-hidden bg-gray-50/30">
      <div className="flex-1 flex gap-0 overflow-hidden">
        {/* Left Side: Agent Details - Fixed Width with Independent Scroll */}
        <div
          className="w-full lg:w-[380px] xl:w-[420px] border-r border-black/10 bg-white overflow-y-auto overflow-x-hidden"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(0,0,0,0.1) transparent'
          }}
        >
          <div className="p-6">
            <AgentProfileDetails agent={mappedAgent} />
          </div>
        </div>

        {/* Right Side: Full Chat Interface - Fills Remaining Space with Independent Scroll */}
        <div className="flex-1 overflow-hidden">
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
