import { VALIDATION_CONSTANTS } from '../types';
import type { CreateFlashcardDTO } from '@/types'



/**
 * Interface representing a message in the OpenRouter chat format
 */
export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Interface representing a chat request to the OpenRouter API
 */
export interface OpenRouterChatRequest {
  messages: OpenRouterMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  response_format?: { 
    type: string; 
    schema?: object;
    json_schema?: {
      name?: string;
      strict?: boolean;
      schema: object;
    }
  };
  stream?: boolean;
}

/**
 * Interface representing a chat response from the OpenRouter API
 */
export interface OpenRouterChatResponse<T = unknown> {
  id: string;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: T;
    };
    finish_reason: string;
  }>;
}

/**
 * Interface representing a stream chunk from the OpenRouter API
 */
export interface OpenRouterChatStreamChunk<T = unknown> {
  id: string;
  model: string;
  choices: Array<{
    delta: {
      role?: string;
      content?: T;
    };
    finish_reason: string | null;
  }>;
}

/**
 * Interface representing a prompt for generating flashcards
 */
export interface FlashcardGenerationPrompt {
  sourceText: string;
  model?: string;
}

/**
 * Configuration options for OpenRouter requests
 */
export interface OpenRouterRequestOptions {
  /** Request timeout in milliseconds */
  timeout?: number;
  /** AbortSignal for request cancellation */
  signal?: AbortSignal;
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Service for interacting with the OpenRouter API
 * Provides methods for chat completions and specialized AI generation tasks
 */
export class OpenRouterService {
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second
  private lastRequestTime = 0;
  private readonly minRequestInterval = 100; // 100ms between requests
  private readonly defaultTimeout = 30000; // 30 seconds

  constructor(
    private readonly apiKey: string,
    private readonly defaultModel: string = 'openai/gpt-4',
    private readonly defaultTemperature: number = 0.7,
    private readonly defaultMaxTokens: number = 1024,
    private readonly baseUrl: string = 'https://openrouter.ai/api/v1',
    private readonly options: OpenRouterRequestOptions = {}
  ) {
    if (!apiKey) {
      throw new Error('OpenRouter API key is required');
    }
  }

  /**
   * Log debug information if debug mode is enabled
   */
  private debug(message: string, data?: unknown): void {
    if (this.options.debug) {
      console.debug(`[OpenRouter] ${message}`, data);
    }
  }

  /**
   * Ensures minimum time between API requests to prevent rate limiting
   * @private
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
      );
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Execute a fetch request with timeout
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit & { timeout?: number }
  ): Promise<Response> {
    const { timeout = this.defaultTimeout, ...fetchOptions } = options;

    this.debug('Sending request', { url, ...fetchOptions });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort('Request timeout');
    }, timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: options.signal 
          ? this.combineSignals(options.signal, controller.signal)
          : controller.signal
      });

      this.debug('Received response', {
        status: response.status,
        statusText: response.statusText
      });

      return response;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        const isTimeout = controller.signal.aborted && !options.signal?.aborted;
        throw new OpenRouterError(
          isTimeout ? 'Request timed out' : 'Request was cancelled',
          408,
          error
        );
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Combine multiple AbortSignals into one
   */
  private combineSignals(...signals: AbortSignal[]): AbortSignal {
    const controller = new AbortController();
    
    for (const signal of signals) {
      if (signal.aborted) {
        controller.abort(signal.reason);
        break;
      }
      
      signal.addEventListener('abort', () => {
        controller.abort(signal.reason);
      }, { once: true });
    }
    
    return controller.signal;
  }

  /**
   * Executes a function with retry logic for transient errors
   * @private
   */
  private async withRetry<T>(
    operation: () => Promise<T>,
    retryCount = 0
  ): Promise<T> {
    try {
      await this.enforceRateLimit();
      return await operation();
    } catch (error) {
      if (
        error instanceof OpenRouterError &&
        error.status >= 500 &&
        retryCount < this.maxRetries
      ) {
        const delay = this.retryDelay * Math.pow(2, retryCount);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.withRetry(operation, retryCount + 1);
      }
      throw error;
    }
  }

  /**
   * Send a chat completion request to the OpenRouter API
   */
  async chat<T = unknown>(params: OpenRouterChatRequest): Promise<OpenRouterChatResponse<T>> {
    return this.withRetry(() => this._chat(params));
  }

  private async _chat<T = unknown>({
    messages,
    model = this.defaultModel,
    temperature = this.defaultTemperature,
    max_tokens = this.defaultMaxTokens,
    response_format,
    stream = false
  }: OpenRouterChatRequest): Promise<OpenRouterChatResponse<T>> {
    if (!messages?.length) {
      throw new Error('Messages array is required and cannot be empty');
    }

    this.debug('Starting chat request', { model, temperature, max_tokens });

    try {
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/chat/completions`,
        {
          method: 'POST',
          headers: this.buildHeaders(),
          body: JSON.stringify(this.buildRequestBody({
            messages,
            model,
            temperature,
            max_tokens,
            response_format,
            stream
          })),
          timeout: this.options.timeout,
          signal: this.options.signal
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new OpenRouterError(
          `API request failed with status ${response.status}`,
          response.status,
          error
        );
      }

      const data = await response.json();
      this.debug('Received chat response', data);
      return data as OpenRouterChatResponse<T>;
    } catch (error) {
      this.debug('Chat request failed', error);
      if (error instanceof OpenRouterError) {
        throw error;
      }
      throw new OpenRouterError(
        'Failed to communicate with OpenRouter API',
        500,
        error
      );
    }
  }

  /**
   * Stream chat completions from the OpenRouter API
   */
  async *streamChat<T = unknown>(params: OpenRouterChatRequest): AsyncGenerator<OpenRouterChatStreamChunk<T>> {
    yield* this._streamChat(params);
  }

  private async *_streamChat<T = unknown>({
    messages,
    model = this.defaultModel,
    temperature = this.defaultTemperature,
    max_tokens = this.defaultMaxTokens,
    response_format
  }: OpenRouterChatRequest): AsyncGenerator<OpenRouterChatStreamChunk<T>> {
    if (!messages?.length) {
      throw new Error('Messages array is required and cannot be empty');
    }

    this.debug('Starting stream chat request', { model, temperature, max_tokens });

    try {
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/chat/completions`,
        {
          method: 'POST',
          headers: this.buildHeaders(),
          body: JSON.stringify(this.buildRequestBody({
            messages,
            model,
            temperature,
            max_tokens,
            response_format,
            stream: true
          })),
          timeout: this.options.timeout,
          signal: this.options.signal
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new OpenRouterError(
          `API request failed with status ${response.status}`,
          response.status,
          error
        );
      }

      if (!response.body) {
        throw new OpenRouterError('Response body is null', 500);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk
            .split('\n')
            .filter(line => line.trim())
            .filter(line => line.startsWith('data: '))
            .map(line => line.slice(6));

          for (const line of lines) {
            if (line === '[DONE]') return;
            try {
              const parsed = JSON.parse(line);
              this.debug('Received stream chunk', parsed);
              yield parsed as OpenRouterChatStreamChunk<T>;
            } catch (e) {
              this.debug('Failed to parse stream chunk', e);
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      this.debug('Stream chat request failed', error);
      if (error instanceof OpenRouterError) {
        throw error;
      }
      throw new OpenRouterError(
        'Failed to communicate with OpenRouter API',
        500,
        error
      );
    }
  }

  /**
   * Generate flashcards from source text using AI
   */
  async generateFlashcards({
    sourceText,
    model = this.defaultModel
  }: FlashcardGenerationPrompt): Promise<CreateFlashcardDTO[]> {
    if (!sourceText) {
      throw new Error('Source text is required');
    }

    if (sourceText.length < VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH) {
      throw new Error(
        `Source text must be at least ${VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH} characters long`
      );
    }

    const systemPrompt = {
      role: 'system' as const,
      content: `You are an expert at creating educational flashcards. Create flashcards from the provided text.
Each flashcard should follow these rules:
1. Front should contain a clear, concise question or concept
2. Back should contain a comprehensive but focused answer
3. Both sides should be self-contained and make sense independently
4. Use clear, simple language
5. Avoid overly complex or compound cards
6. Focus on key concepts and important details
7. Each side must not exceed ${VALIDATION_CONSTANTS.FLASHCARD_TEXT_MAX_LENGTH} characters`
    };

    const userPrompt = {
      role: 'user' as const,
      content: sourceText
    };

    const response = await this.chat<CreateFlashcardDTO[]>({
      messages: [systemPrompt, userPrompt],
      model,
      temperature: 0.7,
      response_format: {
        type: 'json_object',
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              front_text: { 
                type: 'string',
                maxLength: VALIDATION_CONSTANTS.FLASHCARD_TEXT_MAX_LENGTH
              },
              back_text: { 
                type: 'string',
                maxLength: VALIDATION_CONSTANTS.FLASHCARD_TEXT_MAX_LENGTH
              },
              creation: { type: 'string', enum: ['ai'] }
            },
            required: ['front_text', 'back_text', 'creation']
          }
        }
      }
    });

    const flashcards = response.choices[0].message.content;

    // Additional validation of generated flashcards
    for (const flashcard of flashcards) {
      if (
        flashcard.front_text.length > VALIDATION_CONSTANTS.FLASHCARD_TEXT_MAX_LENGTH ||
        flashcard.back_text.length > VALIDATION_CONSTANTS.FLASHCARD_TEXT_MAX_LENGTH
      ) {
        throw new Error(
          `Generated flashcard text exceeds maximum length of ${VALIDATION_CONSTANTS.FLASHCARD_TEXT_MAX_LENGTH} characters`
        );
      }
    }

    return flashcards;
  }

  private buildHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://10x.cards',
      'X-Title': '10x Cards'
    };
  }

  private buildRequestBody<T>({
    messages,
    model,
    temperature,
    max_tokens,
    response_format,
    stream
  }: OpenRouterChatRequest): Record<string, unknown> {
    return {
      messages,
      model,
      temperature,
      max_tokens,
      response_format,
      stream
    };
  }
}

/**
 * Custom error class for OpenRouter API errors
 */
export class OpenRouterError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'OpenRouterError';
  }
}
