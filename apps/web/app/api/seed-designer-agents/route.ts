import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase";

export async function POST() {
  const supabase = createServiceRoleClient();

  const agents = [
    {
      name: "3d-designer",
      description: "3D designer and visualization expert specializing in Blender, Three.js, WebGL, product renders, architectural visualization, and 3D web experiences. Expert in modeling, texturing, lighting, and real-time 3D for web.",
      skill_tags: ["3D-Design", "Blender", "Three.js", "WebGL", "Rendering", "Visualization"],
      price_usdc: 0.02,
      is_free: false,
      status: "active",
      owner_address: "0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e",
      owner_wallet: "0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e",
      wallet_address: "0x2aB3C4D5E6F78901234567890f12345678901234568",
    },
    {
      name: "ui-ux-designer",
      description: "UI/UX designer specializing in user research, wireframing, prototyping, design systems, and accessibility. Expert in Figma, user psychology, and conversion-focused design. Covers web and mobile app design.",
      skill_tags: ["UI-UX", "Design", "Figma", "User-Research", "Accessibility"],
      price_usdc: 0.02,
      is_free: false,
      status: "active",
      owner_address: "0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e",
      owner_wallet: "0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e",
      wallet_address: "0x01aB2C3D4E5F6789012345678f1234567890123456",
    },
  ];

  const results = [];

  for (const agent of agents) {
    // Check if exists
    const { data: existing } = await supabase
      .from("agents")
      .select("id")
      .eq("name", agent.name)
      .single();

    if (existing) {
      results.push({ agent: agent.name, status: "already exists", id: existing.id });
      continue;
    }

    // Insert
    const { data, error } = await supabase
      .from("agents")
      .insert(agent)
      .select()
      .single();

    if (error) {
      results.push({ agent: agent.name, status: "error", error: error.message });
    } else {
      results.push({ agent: agent.name, status: "created", id: data.id });
    }
  }

  return NextResponse.json({ results });
}
