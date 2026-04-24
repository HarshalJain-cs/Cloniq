import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (openaiClient) return openaiClient;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Only throw if we are NOT in the build process
    if (process.env.NODE_ENV === "production" && !process.env.CI) {
      throw new Error("Missing OPENAI_API_KEY");
    }
    // Placeholder for build time
    return new OpenAI({ apiKey: "placeholder" });
  }

  openaiClient = new OpenAI({ apiKey });
  return openaiClient;
}

export async function getOpenAIChatCompletion(
  systemPrompt: string,
  userMessage: string,
  model: string = "gpt-4o"
): Promise<string> {
  const client = getOpenAIClient();

  const completion = await client.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature: 0.7,
    max_tokens: 2048,
  });

  return completion.choices[0]?.message?.content || "I am unable to generate a response at this time.";
}

export function getOpenAIChatCompletionStream(
  systemPrompt: string,
  userMessage: string,
  model: string = "gpt-4o"
): ReadableStream<string> {
  const client = getOpenAIClient();

  return new ReadableStream({
    async start(controller) {
      try {
        const stream = await client.chat.completions.create({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          temperature: 0.7,
          max_tokens: 2048,
          stream: true,
        });

        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(text);
        }

        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}

// Available OpenAI models
export const OPENAI_MODELS = [
  { id: "gpt-4o", name: "GPT-4o (Recommended)", description: "Most capable, multimodal" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "Fast and affordable" },
  { id: "o1-preview", name: "o1 Preview", description: "Advanced reasoning" },
  { id: "o1-mini", name: "o1 Mini", description: "Faster reasoning" },
];
