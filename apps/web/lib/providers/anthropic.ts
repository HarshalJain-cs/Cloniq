import Anthropic from "@anthropic-ai/sdk";

let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (anthropicClient) return anthropicClient;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Only throw if we are NOT in the build process
    if (process.env.NODE_ENV === "production" && !process.env.CI) {
      throw new Error("Missing ANTHROPIC_API_KEY");
    }
    // Placeholder for build time
    return new Anthropic({ apiKey: "placeholder" });
  }

  anthropicClient = new Anthropic({ apiKey });
  return anthropicClient;
}

export async function getAnthropicChatCompletion(
  systemPrompt: string,
  userMessage: string,
  model: string = "claude-sonnet-4-20250514"
): Promise<string> {
  const client = getAnthropicClient();

  const message = await client.messages.create({
    model: model,
    max_tokens: 2048,
    system: systemPrompt,
    messages: [
      { role: "user", content: userMessage },
    ],
    temperature: 0.7,
  });

  const textContent = message.content.find((block) => block.type === "text");
  return textContent && textContent.type === "text"
    ? textContent.text
    : "I am unable to generate a response at this time.";
}

export function getAnthropicChatCompletionStream(
  systemPrompt: string,
  userMessage: string,
  model: string = "claude-sonnet-4-20250514"
): ReadableStream<string> {
  const client = getAnthropicClient();

  return new ReadableStream({
    async start(controller) {
      try {
        const stream = await client.messages.create({
          model: model,
          max_tokens: 2048,
          system: systemPrompt,
          messages: [
            { role: "user", content: userMessage },
          ],
          temperature: 0.7,
          stream: true,
        });

        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(event.delta.text);
          }
        }

        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}

// Available Anthropic models
export const ANTHROPIC_MODELS = [
  { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4.5 (Recommended)", description: "Balanced intelligence and speed" },
  { id: "claude-opus-4-20250514", name: "Claude Opus 4.6", description: "Most capable, complex tasks" },
  { id: "claude-haiku-4-20250514", name: "Claude Haiku 4.5", description: "Fast and affordable" },
];
