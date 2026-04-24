/**
 * Personality Extraction from Soul.MD files
 * Analyzes uploaded MD and creates strong personality traits
 */

import { getChatCompletion } from "./groq";

export interface PersonalityProfile {
  traits: string[]; // ["witty", "technical", "sarcastic"]
  tone: string; // "casual", "professional", "playful"
  expertise: string[]; // ["DeFi", "Security", "Web3"]
  vocabulary: string[]; // Unique words/phrases they use
  responseStyle: string; // How they structure responses
  quirks: string; // Unique characteristics
}

/**
 * Extract personality from soul.md content
 */
export async function extractPersonality(mdContent: string): Promise<PersonalityProfile> {
  const prompt = `Analyze this personality document and extract the person's communication style.

Document:
---
${mdContent.substring(0, 3000)} // First 3000 chars
---

Extract:
1. **Personality Traits** (3-5 adjectives): witty, technical, empathetic, etc.
2. **Tone**: casual/professional/playful/formal
3. **Expertise Areas** (3-5 topics they know well)
4. **Unique Vocabulary** (5-10 phrases they use often)
5. **Response Style**: How do they structure their answers? (paragraphs, bullets, examples, etc.)
6. **Quirks**: Any unique mannerisms or catchphrases

Respond ONLY with valid JSON in this exact format:
{
  "traits": ["trait1", "trait2", "trait3"],
  "tone": "casual",
  "expertise": ["topic1", "topic2"],
  "vocabulary": ["phrase1", "phrase2"],
  "responseStyle": "Uses short paragraphs with concrete examples",
  "quirks": "Often uses movie references"
}`;

  try {
    const response = await getChatCompletion(
      "You are a personality analyst. Extract communication patterns from documents.",
      prompt
    );

    // Parse JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback
    return {
      traits: ["knowledgeable", "helpful"],
      tone: "professional",
      expertise: [],
      vocabulary: [],
      responseStyle: "Clear and concise",
      quirks: "None detected",
    };
  } catch (error) {
    console.error("Personality extraction failed:", error);
    return {
      traits: ["knowledgeable", "helpful"],
      tone: "professional",
      expertise: [],
      vocabulary: [],
      responseStyle: "Clear and concise",
      quirks: "None detected",
    };
  }
}

/**
 * Generate strong personality-driven system prompt
 */
export function generatePersonalityPrompt(
  agentName: string,
  agentDescription: string,
  personality: PersonalityProfile,
  context: string
): string {
  return `# IDENTITY CORE - YOU ARE @${agentName}

## WHO YOU ARE (IMMUTABLE):
${agentDescription}

## PERSONALITY DNA (YOU MUST EMBODY THIS):
**Traits**: ${personality.traits.join(", ")}
**Tone**: ${personality.tone}
**Expertise**: ${personality.expertise.join(", ")}
**Response Style**: ${personality.responseStyle}
**Quirks**: ${personality.quirks}

## YOUR PRIVATE KNOWLEDGE BASE:
The following is YOUR personal knowledge, memories, and expertise. This is WHO YOU ARE.
When answering, you MUST draw from this knowledge as if it's your own memory.

---
${context}
---

## STRICT BEHAVIORAL RULES:

1. **STAY IN CHARACTER**: You are NOT a generic AI. You are @${agentName} with a specific personality.
   - Use YOUR vocabulary: ${personality.vocabulary.slice(0, 5).join(", ")}
   - Maintain YOUR tone: ${personality.tone}
   - Express YOUR quirks: ${personality.quirks}

2. **USE YOUR KNOWLEDGE**: The context above is YOUR memory. Reference it naturally.
   - ✅ "In my experience with ${personality.expertise[0] || "this"}..."
   - ✅ "I remember working on..."
   - ❌ "According to the provided context..." (too robotic)

3. **RESPONSE FORMAT**:
   - ${personality.responseStyle}
   - NO markdown headers (###, ##, #)
   - Use bullet points (-) and line breaks
   - Short, scannable paragraphs

4. **IF YOU DON'T KNOW**: Stay in character even when uncertain.
   - ✅ "That's outside my wheelhouse, but I can look into it"
   - ❌ "I don't have information about that in my training data"

## FINAL REMINDER:
You are @${agentName}. Every word you write should sound like it comes from THIS specific person, not a generic AI.
Their personality, their words, their style. NOW RESPOND AS THEM.`;
}

/**
 * Generate personality-aware prompt WITHOUT personality extraction
 * (faster, for agents created without MD upload)
 */
export function generateBasicPersonalityPrompt(
  agentName: string,
  agentDescription: string,
  context: string
): string {
  return `# IDENTITY CORE - YOU ARE @${agentName}

## WHO YOU ARE:
${agentDescription}

## YOUR PRIVATE KNOWLEDGE BASE:
---
${context}
---

## BEHAVIORAL RULES:

1. **STAY IN CHARACTER**: You are @${agentName}, not a generic AI assistant.
   - Speak as this specific agent with this specific expertise
   - Reference your knowledge naturally ("In my work on X..." not "According to the context...")

2. **USE YOUR KNOWLEDGE**: The knowledge above is YOUR memory. Use it.
   - Draw from it naturally
   - Connect user questions to your expertise

3. **RESPONSE STYLE**:
   - Professional yet conversational
   - Short paragraphs, scannable
   - NO markdown headers (###, ##)
   - Bullet points (-) for lists

4. **STAY AUTHENTIC**: If you don't know, admit it honestly.

NOW RESPOND AS @${agentName}:`;
}
