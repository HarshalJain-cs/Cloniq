import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getEmbedding } from "./embeddings";
import { getChatCompletion, getChatCompletionStream } from "./groq";
import { generateBasicPersonalityPrompt, type PersonalityProfile, generatePersonalityPrompt } from "./personality-extractor";

let supabaseClient: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
    if (supabaseClient) return supabaseClient;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        // Only throw if NOT in build mode
        if (process.env.NODE_ENV === "production" && !process.env.CI) {
            throw new Error("Missing Supabase environment variables");
        }
        // Placeholder for build time analysis
        return createClient(
            "https://placeholder-url.supabase.co",
            "placeholder-key"
        );
    }

    supabaseClient = createClient(url, key);
    return supabaseClient;
}

export async function runAgentQuery(
    agentId: string,
    agentName: string,
    agentDescription: string,
    question: string,
    personality?: PersonalityProfile | null
): Promise<string> {
    const supabase = getSupabase();
    const embedding = await getEmbedding(question);

    let context = "None provided.";
    if (embedding) {
        const { data: memories, error } = await supabase.rpc("match_agent_memories", {
            query_embedding: embedding,
            filter_agent_id: agentId,
            match_count: 5,
        });
        if (error) console.error("Error fetching memories:", error);
        if (memories?.length) context = memories.map((m: any) => m.content).join("\n\n");
    }

    // Use strong personality-driven prompt
    const systemPrompt = personality
        ? generatePersonalityPrompt(agentName, agentDescription, personality, context)
        : generateBasicPersonalityPrompt(agentName, agentDescription, context);

    return getChatCompletion(systemPrompt, question);
}

export async function streamAgentQuery(
    agentId: string,
    agentName: string,
    agentDescription: string,
    question: string,
    personality?: PersonalityProfile | null
): Promise<ReadableStream<string>> {
    const supabase = getSupabase();
    const embedding = await getEmbedding(question);

    let context = "None provided.";
    if (embedding) {
        const { data: memories, error } = await supabase.rpc("match_agent_memories", {
            query_embedding: embedding,
            filter_agent_id: agentId,
            match_count: 5,
        });
        if (error) console.error("Error fetching memories:", error);
        if (memories?.length) context = memories.map((m: any) => m.content).join("\n\n");
    }

    // Use strong personality-driven prompt
    const systemPrompt = personality
        ? generatePersonalityPrompt(agentName, agentDescription, personality, context)
        : generateBasicPersonalityPrompt(agentName, agentDescription, context);

    return getChatCompletionStream(systemPrompt, question);
}

export async function seedAgentMemory(
    agentId: string,
    content: string,
    source: string = "Initial Seed"
) {
    const supabase = getSupabase();
    // Simple chunking strategy (e.g., 500 chars)
    const chunkSize = 500;
    const overlap = 50;
    const chunks: string[] = [];

    for (let i = 0; i < content.length; i += chunkSize - overlap) {
        chunks.push(content.slice(i, i + chunkSize));
    }

    const memoryEntries = await Promise.all(
        chunks.map(async (chunk) => {
            const embedding = await getEmbedding(chunk);
            return {
                agent_id: agentId,
                content: chunk,
                embedding: embedding,
                source: source,
                access: "public",
            };
        })
    );

    const { error } = await supabase.from("agent_memories").insert(memoryEntries);

    if (error) throw error;
    return chunks.length;
}
