export const AI_CONFIG = {
  openrouter: {
    defaultModel: "openai/gpt-4o-mini",
    temperature: 0.7,
    maxTokens: 1024, // Reduced from 2048 to 1024 as it's sufficient for our use case
    baseUrl: "https://openrouter.ai/api/v1",
  },
} as const;

// Available models - you can extend this list
export const OPENROUTER_MODELS = [
  "openai/gpt-4-mini",
  "openai/gpt-3.5-turbo",
  "anthropic/claude-2",
  "google/palm-2-chat-bison",
  "meta-llama/llama-2-70b-chat",
] as const;

export type OpenRouterModel = (typeof OPENROUTER_MODELS)[number];
