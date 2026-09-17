import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

export interface LLMAttachment {
  mimeType: string;
  data: string;
}

export interface LLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  attachments?: LLMAttachment[];
}

export interface LLMRequest {
  model: string;
  messages: LLMMessage[];
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface DocumentChunkRequest {
  text: string;
  chunk_size?: number;
  overlap?: number;
}

export interface ChunkResponse {
  chunks: string[];
}

export interface EmbeddingRequest {
  texts: string[];
}

export interface EmbeddingResponse {
  embeddings: number[][];
}

export interface LLMResponse {
  content: string;
  model: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
}

export interface LLMChunk {
  content: string;
}

export interface LLMProvider {
  generateText(request: LLMRequest): Promise<LLMResponse>;
  streamText(request: LLMRequest): AsyncIterable<LLMChunk>;
}

export class AIQuotaError extends Error {
  code = 'RATE_LIMITED';
  statusCode = 429;
  retryAfter?: number;

  constructor(message: string, retryAfter?: number, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'AIQuotaError';
    this.retryAfter = retryAfter;
  }
}

export class ClaudeProvider implements LLMProvider {
  private client: Anthropic;

  constructor(apiKey?: string) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
    });
  }

  private buildContent(m: LLMMessage): any {
    if (!m.attachments?.length) return m.content;
    const blocks: any[] = [];
    if (m.content) blocks.push({ type: 'text', text: m.content });
    for (const att of m.attachments) {
      if (att.mimeType.startsWith('image/')) {
        blocks.push({
          type: 'image',
          source: { type: 'base64', media_type: att.mimeType, data: att.data },
        });
      } else if (att.mimeType === 'application/pdf') {
        blocks.push({
          type: 'document',
          source: { type: 'base64', media_type: 'application/pdf', data: att.data },
        });
      }
    }
    return blocks;
  }

  async generateText(request: LLMRequest): Promise<LLMResponse> {
    const response = await this.client.messages.create({
      model: request.model || 'claude-3-5-sonnet-20241022',
      max_tokens: request.maxTokens || 1024,
      system: request.systemPrompt,
      messages: request.messages.map((m) => ({
        role: m.role === 'system' ? 'user' : m.role,
        content: this.buildContent(m),
      })),
      temperature: request.temperature ?? 0.7,
    });

    const textContent = response.content
      .filter((block: any) => block.type === 'text')
      .map((block: any) => block.text)
      .join('');

    return {
      content: textContent,
      model: request.model,
      provider: 'anthropic',
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    };
  }

  async *streamText(request: LLMRequest): AsyncIterable<LLMChunk> {
    const stream = await this.client.messages.create({
      model: request.model || 'claude-3-5-sonnet-20241022',
      max_tokens: request.maxTokens || 1024,
      system: request.systemPrompt,
      messages: request.messages.map((m) => ({
        role: m.role === 'system' ? 'user' : m.role,
        content: this.buildContent(m),
      })),
      temperature: request.temperature ?? 0.7,
      stream: true,
    });

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        yield { content: chunk.delta.text };
      }
    }
  }
}

export class OpenAIProvider implements LLMProvider {
  private client?: OpenAI;
  private providedApiKey?: string;

  constructor(apiKey?: string) {
    this.providedApiKey = apiKey;
  }

  private getClient(): OpenAI {
    if (!this.client) {
      const apiKey = this.providedApiKey || process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("The OPENAI_API_KEY environment variable is missing or empty.");
      }
      this.client = new OpenAI({ apiKey });
    }
    return this.client;
  }

  private buildContent(m: LLMMessage): OpenAI.Chat.Completions.ChatCompletionContentPart[] | string {
    const images = (m.attachments || []).filter((a) => a.mimeType.startsWith('image/'));
    if (m.content && images.length) {
      return [
        { type: 'text', text: m.content },
        ...images.map((a) => ({
          type: 'image_url' as const,
          image_url: { url: `data:${a.mimeType};base64,${a.data}` },
        })),
      ];
    }
    if (!m.content && images.length) {
      return images.map((a) => ({
        type: 'image_url' as const,
        image_url: { url: `data:${a.mimeType};base64,${a.data}` },
      }));
    }
    return m.content;
  }

  async generateText(request: LLMRequest): Promise<LLMResponse> {
    const client = this.getClient();
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
    if (request.systemPrompt) {
      messages.push({ role: 'system', content: request.systemPrompt });
    }
    request.messages.forEach((m) => {
      messages.push({
        role: m.role,
        content: this.buildContent(m),
      } as OpenAI.Chat.Completions.ChatCompletionMessageParam);
    });

    const response = await client.chat.completions.create({
      model: request.model || 'gpt-4o',
      messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens || 1024,
    });

    return {
      content: response.choices[0]?.message?.content || '',
      model: request.model,
      provider: 'openai',
      inputTokens: response.usage?.prompt_tokens || 0,
      outputTokens: response.usage?.completion_tokens || 0,
    };
  }

  async *streamText(request: LLMRequest): AsyncIterable<LLMChunk> {
    const client = this.getClient();
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
    if (request.systemPrompt) {
      messages.push({ role: 'system', content: request.systemPrompt });
    }
    request.messages.forEach((m) => {
      messages.push({
        role: m.role,
        content: this.buildContent(m),
      } as OpenAI.Chat.Completions.ChatCompletionMessageParam);
    });

    const stream = await client.chat.completions.create({
      model: request.model || 'gpt-4o',
      messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens || 1024,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        yield { content };
      }
    }
  }
}

export class GeminiProvider implements LLMProvider {
  private client: GoogleGenerativeAI;
  private maxRetries = 2;

  /**
   * Ordered fallback models used when a model is rate-limit-quota exhausted or unavailable.
   * Each model carries its own Free Tier quota, so rotating across them keeps the app usable.
   */
  private fallbackModels = [
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-flash-latest',
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash-lite',
    'gemini-flash-lite-latest',
  ];

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY || '';
    this.client = new GoogleGenerativeAI(key);
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private msgOf(error: any): string {
    return String(error?.message || '') + ' ' + String(error?.statusText || '');
  }

  private is5xx(msg: string): boolean {
    return /(503|502|500|UNAVAILABLE|overloaded)/i.test(msg);
  }

  private isDailyQuota(msg: string): boolean {
    return /PerDay|free_tier_requests|GenerateRequestsPerDay/i.test(msg);
  }

  private isTransientQuota(msg: string): boolean {
    return /(429|quota|rate.?limit|PerMinute|PerHour)/i.test(msg) && !this.isDailyQuota(msg);
  }

  private isModelUnavailable(msg: string): boolean {
    return /(is not found|NOT_FOUND|no longer available|not supported)/i.test(msg);
  }

  private retryDelayMs(msg: string): number {
    const match =
      msg.match(/retry in ([0-9.]+)s/i) || msg.match(/retryAfter["':\s]+([0-9.]+)/i);
    const seconds = match ? parseFloat(match[1]) : 2;
    return Math.max(500, Math.min(seconds * 1000, 15000));
  }

  private modelQueue(primary: string): string[] {
    return [primary, ...this.fallbackModels.filter((m) => m !== primary)];
  }

  private buildContents(request: LLMRequest) {
    return request.messages.map((m) => {
      const parts: any[] = [];
      if (m.content) parts.push({ text: m.content });
      for (const att of m.attachments || []) {
        parts.push({ inlineData: { mimeType: att.mimeType, data: att.data } });
      }
      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts,
      };
    });
  }

  private buildConfig(request: LLMRequest) {
    return {
      temperature: request.temperature ?? 0.7,
      maxOutputTokens: request.maxTokens || 1024,
    };
  }

  private async callOnce(modelName: string, request: LLMRequest): Promise<LLMResponse> {
    const model = this.client.getGenerativeModel({ model: modelName });
    const result = await model.generateContent({
      contents: this.buildContents(request),
      generationConfig: this.buildConfig(request),
    });
    const response = result.response;
    return {
      content: response.text(),
      model: modelName,
      provider: 'gemini',
      inputTokens: (response as any).usageMetadata?.promptTokenCount || 0,
      outputTokens: (response as any).usageMetadata?.candidatesTokenCount || 0,
    };
  }

  async generateText(request: LLMRequest): Promise<LLMResponse> {
    const primary = request.model || this.fallbackModels[0];
    let lastError: any;

    for (const modelName of this.modelQueue(primary)) {
      try {
        return await this.callOnce(modelName, request);
      } catch (error: any) {
        lastError = error;
        const msg = this.msgOf(error);

        if (this.is5xx(msg)) {
          for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            const delay = Math.pow(2, attempt - 1) * 1000;
            console.log(`Gemini ${modelName} unavailable (${msg.slice(0, 80)}). Retry in ${delay}ms (${attempt}/${this.maxRetries}).`);
            await this.sleep(delay);
            try {
              return await this.callOnce(modelName, request);
            } catch (retryError: any) {
              lastError = retryError;
              if (!this.is5xx(this.msgOf(retryError))) {
                const retryMsg = this.msgOf(retryError);
                if (this.isDailyQuota(retryMsg) || this.isModelUnavailable(retryMsg)) break;
                if (this.isTransientQuota(retryMsg)) {
                  await this.sleep(this.retryDelayMs(retryMsg));
                  try {
                    return await this.callOnce(modelName, request);
                  } catch (inner: any) {
                    lastError = inner;
                    break;
                  }
                }
              }
            }
          }
          continue;
        }

        if (this.isTransientQuota(msg)) {
          const wait = this.retryDelayMs(msg);
          console.log(`Gemini ${modelName} rate limited. Waiting ${wait}ms then retrying.`);
          await this.sleep(wait);
          try {
            return await this.callOnce(modelName, request);
          } catch (retryError: any) {
            lastError = retryError;
            const retryMsg = this.msgOf(retryError);
            if (!this.isDailyQuota(retryMsg)) continue;
          }
        }

        if (this.isDailyQuota(msg) || this.isModelUnavailable(msg)) {
          console.log(`Gemini ${modelName} quota/unavailable. Falling back to next model.`);
          continue;
        }

        throw error;
      }
    }

    throw new AIQuotaError(
      'Daily Gemini quota exhausted for all available models. Try again later or switch provider in the model selector.',
      lastError instanceof AIQuotaError ? lastError.retryAfter : undefined,
      { cause: lastError }
    );
  }

  async *streamText(request: LLMRequest): AsyncIterable<LLMChunk> {
    const primary = request.model || this.fallbackModels[0];
    let lastError: any;

    for (const modelName of this.modelQueue(primary)) {
      try {
        const model = this.client.getGenerativeModel({ model: modelName });
        const result = await model.generateContentStream({
          contents: this.buildContents(request),
          generationConfig: this.buildConfig(request),
        });
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          if (chunkText) {
            yield { content: chunkText };
          }
        }
        return;
      } catch (error: any) {
        lastError = error;
        const msg = this.msgOf(error);

        if (this.is5xx(msg)) {
          const delay = Math.pow(2, 0) * 1000;
          console.log(`Gemini ${modelName} stream unavailable, retrying in ${delay}ms...`);
          await this.sleep(delay);
          try {
            const model = this.client.getGenerativeModel({ model: modelName });
            const result = await model.generateContentStream({
              contents: this.buildContents(request),
              generationConfig: this.buildConfig(request),
            });
            for await (const chunk of result.stream) {
              const chunkText = chunk.text();
              if (chunkText) {
                yield { content: chunkText };
              }
            }
            return;
          } catch (retryError: any) {
            lastError = retryError;
          }
          continue;
        }

        if (this.isDailyQuota(msg) || this.isModelUnavailable(msg)) {
          console.log(`Gemini ${modelName} stream quota/unavailable. Falling back to next model.`);
          continue;
        }

        throw error;
      }
    }

    throw new AIQuotaError(
      'Daily Gemini quota exhausted for all available models. Try again later or switch provider in the model selector.',
      undefined,
      { cause: lastError }
    );
  }
}

export class AIOrchestrationService {
  private providers: Record<string, LLMProvider> = {};

  getProvider(providerName: string): LLMProvider {
    if (!this.providers[providerName]) {
      if (providerName === 'anthropic') {
        this.providers[providerName] = new ClaudeProvider();
      } else if (providerName === 'openai') {
        this.providers[providerName] = new OpenAIProvider();
      } else if (providerName === 'gemini') {
        this.providers[providerName] = new GeminiProvider();
      } else {
        throw new Error(`Unknown LLM provider: ${providerName}`);
      }
    }
    return this.providers[providerName];
  }
}
