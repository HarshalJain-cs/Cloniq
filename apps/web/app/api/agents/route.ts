import { NextRequest, NextResponse } from "next/server";
import { createAgentWallet } from "@/lib/agentkit";
import { seedAgentMemory } from "@/lib/rag";
import { createServiceRoleClient } from "@/lib/supabase";
import { extractPersonality } from "@/lib/personality-extractor";

export const dynamic = "force-dynamic";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

const NAME_REGEX = /^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tags = searchParams.get("tags");
    const search = searchParams.get("search");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const page = pageParam === null ? 1 : Number(pageParam);
    if (!Number.isInteger(page) || page < 1) {
      return NextResponse.json(
        { error: "page must be a positive integer" },
        { status: 400 }
      );
    }

    const parsedLimit = limitParam === null ? 12 : Number(limitParam);
    if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
      return NextResponse.json(
        { error: "limit must be a positive integer" },
        { status: 400 }
      );
    }

    const limit = Math.min(parsedLimit, 50);
    const offset = (page - 1) * limit;

    const supabase = createServiceRoleClient();

    const ownerWallet = searchParams.get("owner_wallet");

    let query = supabase
      .from("agents")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (!ownerWallet) {
      query = query.eq("status", "active");
    }

    if (ownerWallet) {
      query = query.eq("owner_wallet", ownerWallet.toLowerCase());
    }

    if (tags) {
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      if (tagArray.length > 0) {
        query = query.contains("skill_tags", tagArray);
      }
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    query = query.range(offset, offset + limit - 1);

    const { data: agents, count, error } = await query;

    if (error) {
      console.error("[GET /api/agents] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch agents" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      agents: agents ?? [],
      total: count ?? 0,
      page,
      limit,
    });
  } catch (err) {
    console.error("[GET /api/agents] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as
      | Record<string, unknown>
      | null;

    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }
    const {
      name,
      description,
      skillTags,
      priceUsdc,
      isInitiallyFree,
      initialMemory,
      ensName,
      ownerWallet,
      llmProvider,
      llmModel,
      openaiApiKey,
      anthropicApiKey,
      twitterPersonality,
      moodExcited,
      moodFrustrated,
      moodThoughtful,
      moodHelpful,
      moodCasual,
    } = body;

    if (!isNonEmptyString(name)) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const normalizedName = name.trim();

    if (!NAME_REGEX.test(normalizedName)) {
      return NextResponse.json(
        {
          error:
            "Invalid name. Must be 3-64 chars, lowercase alphanumeric and hyphens only, cannot start/end with hyphen.",
        },
        { status: 400 }
      );
    }

    if (typeof description !== "string" || description.trim().length < 10) {
      return NextResponse.json(
        { error: "Description is required (min 10 chars)" },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    const { data: existing, error: existingError } = await supabase
      .from("agents")
      .select("id")
      .eq("name", normalizedName)
      .maybeSingle();

    if (existingError) {
      console.error("[POST /api/agents] Name lookup failed:", existingError);
      return NextResponse.json(
        { error: "Failed to validate agent name" },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { error: `Agent name "${normalizedName}" is already taken` },
        { status: 409 }
      );
    }

    let walletAddress: string | null = null;
    try {
      walletAddress = await createAgentWallet(normalizedName);
    } catch (err) {
      console.error("[POST /api/agents] Wallet creation failed:", err);
    }

    const isFree = isInitiallyFree !== false;
    const rawPrice = priceUsdc ?? 0;
    const price = typeof rawPrice === "number" ? rawPrice : Number(rawPrice);

    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json(
        { error: "priceUsdc must be a non-negative number" },
        { status: 400 }
      );
    }

    const tags = Array.isArray(skillTags)
      ? skillTags.filter(
          (tag): tag is string => typeof tag === "string" && tag.trim().length > 0
        )
      : [];

    // Validate and set LLM provider and model
    const ALLOWED_PROVIDERS = ["groq", "openai", "anthropic"];
    const selectedProvider = typeof llmProvider === "string" && ALLOWED_PROVIDERS.includes(llmProvider)
      ? llmProvider
      : "groq";

    const selectedModel = typeof llmModel === "string" && llmModel.trim().length > 0
      ? llmModel
      : (selectedProvider === "openai" ? "gpt-4o" :
         selectedProvider === "anthropic" ? "claude-sonnet-4-20250514" :
         "llama-3.3-70b-versatile");

    // Validate API keys for OpenAI and Anthropic
    if (selectedProvider === "openai") {
      if (!isNonEmptyString(openaiApiKey)) {
        return NextResponse.json(
          { error: "OpenAI API key is required when using OpenAI models" },
          { status: 400 }
        );
      }
    }

    if (selectedProvider === "anthropic") {
      if (!isNonEmptyString(anthropicApiKey)) {
        return NextResponse.json(
          { error: "Anthropic API key is required when using Anthropic models" },
          { status: 400 }
        );
      }
    }

    // Prepare agent data with optional API keys
    const agentData: Record<string, any> = {
      name: normalizedName,
      description: description.trim(),
      owner_address: typeof ownerWallet === "string" ? ownerWallet : "0x0000000000000000000000000000000000000000",
      owner_wallet: typeof ownerWallet === "string" ? ownerWallet.toLowerCase() : null,
      wallet_address: walletAddress,
      skill_tags: tags,
      price_usdc: price,
      is_free: isFree,
      ens_name: typeof ensName === "string" ? ensName.trim() : null,
      endpoint_url: `/api/agents/${normalizedName}/ask`,
      status: "active",
      llm_provider: selectedProvider,
      llm_model: selectedModel,
    };

    // Add API keys only if provided (store encrypted in production)
    if (selectedProvider === "openai" && isNonEmptyString(openaiApiKey)) {
      agentData.openai_api_key = openaiApiKey;
    }

    if (selectedProvider === "anthropic" && isNonEmptyString(anthropicApiKey)) {
      agentData.anthropic_api_key = anthropicApiKey;
    }

    const { data: agent, error: insertError } = await supabase
      .from("agents")
      .insert(agentData)
      .select()
      .single();

    if (insertError) {
      console.error("[POST /api/agents] Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create agent" },
        { status: 500 }
      );
    }

    let chunksCreated = 0;
    let personalityExtracted = null;

    // Combine all personality sources
    const personalitySources = [];

    // 1. Twitter personality
    if (typeof twitterPersonality === "string" && twitterPersonality.trim().length > 0) {
      personalitySources.push(`TWITTER ANALYSIS:\n${twitterPersonality}`);
    }

    // 2. 5 Mood responses
    const moodResponses = [];
    if (moodExcited) moodResponses.push(`EXCITED: "${moodExcited}"`);
    if (moodFrustrated) moodResponses.push(`FRUSTRATED: "${moodFrustrated}"`);
    if (moodThoughtful) moodResponses.push(`THOUGHTFUL: "${moodThoughtful}"`);
    if (moodHelpful) moodResponses.push(`HELPFUL: "${moodHelpful}"`);
    if (moodCasual) moodResponses.push(`CASUAL: "${moodCasual}"`);

    if (moodResponses.length > 0) {
      personalitySources.push(`EMOTIONAL RANGE:\n${moodResponses.join('\n')}`);
    }

    // Create comprehensive personality profile
    if (personalitySources.length > 0) {
      try {
        console.log(`[POST /api/agents] Building personality profile for ${normalizedName}...`);

        // Combine all sources
        const combinedPersonality = personalitySources.join('\n\n');

        // Extract final personality using Groq
        const groqApiKey = process.env.GROQ_API_KEY;
        if (groqApiKey) {
          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${groqApiKey}`,
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [
                {
                  role: "system",
                  content: `You are a personality extraction expert. Analyze the provided data and create a comprehensive personality profile that captures:
1. EXACT communication style (tone, word choice, sentence structure, punctuation)
2. EMOTIONAL range across different moods
3. Specific phrases, slang, and expressions they use
4. Emojis and how they're used
5. Core values and motivations
6. Humor style
7. Decision-making approach

Create a profile that an AI agent can use to CLONE this person's communication style exactly. Be specific about HOW they talk, not just what they talk about.`,
                },
                {
                  role: "user",
                  content: combinedPersonality,
                },
              ],
              temperature: 0.7,
              max_tokens: 1000,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            personalityExtracted = data.choices[0]?.message?.content || combinedPersonality;
          } else {
            personalityExtracted = combinedPersonality;
          }
        } else {
          personalityExtracted = combinedPersonality;
        }

        // Store personality in agent record
        await supabase
          .from("agents")
          .update({ personality: personalityExtracted })
          .eq("id", agent.id);

        console.log(`[POST /api/agents] Personality profile created for ${normalizedName}`);
      } catch (err) {
        console.error("[POST /api/agents] Personality extraction failed:", err);
      }
    }

    // Handle initial memory/knowledge base
    if (
      typeof initialMemory === "string" &&
      initialMemory.trim().length > 0
    ) {
      try {
        // Seed memory chunks
        chunksCreated = await seedAgentMemory(
          agent.id,
          initialMemory,
          "initial-seed"
        );

        // Extract personality from MD file (if no Twitter personality)
        if (!personalityExtracted) {
          console.log(`[POST /api/agents] Extracting personality from memory for ${normalizedName}...`);
          personalityExtracted = await extractPersonality(initialMemory);

          // Store personality in agent record
          await supabase
            .from("agents")
            .update({ personality: personalityExtracted })
            .eq("id", agent.id);

          console.log(`[POST /api/agents] Personality extracted:`, personalityExtracted);
        }
      } catch (err) {
        console.error("[POST /api/agents] Memory/personality processing failed:", err);
      }
    }

    return NextResponse.json(
      {
        agent,
        walletAddress,
        chunksCreated,
        personalityExtracted: personalityExtracted ? true : false,
        message: `Agent "${normalizedName}" created successfully`,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/agents] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
