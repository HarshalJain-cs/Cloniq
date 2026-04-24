import { getChatCompletion as getGroqCompletion, getChatCompletionStream as getGroqStream } from "./groq";
import { getOpenAIChatCompletion, getOpenAIChatCompletionStream, OPENAI_MODELS } from "./providers/openai";
import { getAnthropicChatCompletion, getAnthropicChatCompletionStream, ANTHROPIC_MODELS } from "./providers/anthropic";

export type LLMProvider = "groq" | "openai" | "anthropic";

export interface LLMModel {
  id: string;
  name: string;
  description: string;
}

// Groq models
export const GROQ_MODELS: LLMModel[] = [
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B Versatile (Recommended)", description: "High performance, balanced" },
  { id: "llama-3.1-70b-versatile", name: "Llama 3.1 70B Versatile", description: "Previous generation, reliable" },
  { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant", description: "Fast and efficient" },
  { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", description: "32k context window" },
  { id: "gemma2-9b-it", name: "Gemma 2 9B IT", description: "Lightweight, instruction-tuned" },
];

// Model registry by provider
export const MODEL_REGISTRY: Record<LLMProvider, LLMModel[]> = {
  groq: GROQ_MODELS,
  openai: OPENAI_MODELS,
  anthropic: ANTHROPIC_MODELS,
};

/**
 * Unified LLM completion function - routes to appropriate provider
 */
export async function getLLMCompletion(
  systemPrompt: string,
  userMessage: string,
  provider: LLMProvider = "groq",
  model?: string
): Promise<string> {
  try {
    switch (provider) {
      case "groq":
        return await getGroqCompletion(systemPrompt, userMessage, model || "llama-3.3-70b-versatile");

      case "openai":
        return await getOpenAIChatCompletion(systemPrompt, userMessage, model || "gpt-4o");

      case "anthropic":
        return await getAnthropicChatCompletion(systemPrompt, userMessage, model || "claude-sonnet-4-20250514");

      default:
        throw new Error(`Unknown LLM provider: ${provider}`);
    }
  } catch (error) {
    console.error(`[LLM Provider Error] ${provider}/${model}:`, error);

    // Fallback to Groq if primary provider fails
    if (provider !== "groq") {
      console.log("[LLM Provider] Falling back to Groq...");
      return await getGroqCompletion(systemPrompt, userMessage, "llama-3.3-70b-versatile");
    }

    throw error;
  }
}

/**
 * Unified LLM streaming function - routes to appropriate provider
 */
export function getLLMCompletionStream(
  systemPrompt: string,
  userMessage: string,
  provider: LLMProvider = "groq",
  model?: string
): ReadableStream<string> {
  try {
    switch (provider) {
      case "groq":
        return getGroqStream(systemPrompt, userMessage, model || "llama-3.3-70b-versatile");

      case "openai":
        return getOpenAIChatCompletionStream(systemPrompt, userMessage, model || "gpt-4o");

      case "anthropic":
        return getAnthropicChatCompletionStream(systemPrompt, userMessage, model || "claude-sonnet-4-20250514");

      default:
        throw new Error(`Unknown LLM provider: ${provider}`);
    }
  } catch (error) {
    console.error(`[LLM Stream Error] ${provider}/${model}:`, error);

    // Fallback to Groq if primary provider fails
    if (provider !== "groq") {
      console.log("[LLM Stream] Falling back to Groq...");
      return getGroqStream(systemPrompt, userMessage, "llama-3.3-70b-versatile");
    }

    throw error;
  }
}

/**
 * Get available models for a provider
 */
export function getModelsForProvider(provider: LLMProvider): LLMModel[] {
  return MODEL_REGISTRY[provider] || [];
}

/**
 * Validate if a model is available for a provider
 */
export function isValidModel(provider: LLMProvider, modelId: string): boolean {
  const models = getModelsForProvider(provider);
  return models.some((m) => m.id === modelId);
}

/**
 * Get default model for a provider
 */
export function getDefaultModel(provider: LLMProvider): string {
  const models = getModelsForProvider(provider);
  return models[0]?.id || "llama-3.3-70b-versatile";
}
