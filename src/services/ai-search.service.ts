import { Injectable, signal } from '@angular/core';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { environment } from '../environments/environment';

export interface AiCodeFile {
  filename: string;
  language: string;
  code: string;
}

export interface AiSearchResult {
  theory: string;
  files: AiCodeFile[];
}

export type SearchState = 'idle' | 'loading' | 'success' | 'error';
export type ErrorType = 'quota' | 'auth' | 'network' | 'generic';

@Injectable({ providedIn: 'root' })
export class AiSearchService {
  private readonly ai = new GoogleGenerativeAI(environment.geminiApiKey);

  readonly state = signal<SearchState>('idle');
  readonly result = signal<AiSearchResult | null>(null);
  readonly errorMessage = signal<string>('');
  readonly errorType = signal<ErrorType>('generic');

  async searchTopic(query: string): Promise<void> {
    this.state.set('loading');
    this.result.set(null);
    this.errorMessage.set('');

    const systemInstruction = `You are an expert Angular and web development educator.
When given a topic, produce a comprehensive, beginner-friendly explanation and complete, runnable code examples.
The "theory" field MUST be detailed markdown explaining the concept clearly with examples.
The "files" array MUST contain fully functional code files with inline comments explaining every key line.
Always return at least 2-3 code files (e.g., component .ts, .html, and optionally .css/.scss or a service).
Write code that can be directly copied into an Angular project and run without modification.`;

    try {
      const model = this.ai.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              theory: {
                type: SchemaType.STRING,
                description: 'Comprehensive markdown explanation of the topic, including concepts, use-cases, and best practices.'
              },
              files: {
                type: SchemaType.ARRAY,
                description: 'Array of fully functional, runnable code files with inline comments.',
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    filename: {
                      type: SchemaType.STRING,
                      description: 'File name, e.g. counter.component.ts'
                    },
                    language: {
                      type: SchemaType.STRING,
                      description: 'Language identifier: typescript, html, css, scss, json'
                    },
                    code: {
                      type: SchemaType.STRING,
                      description: 'Complete, runnable code with inline comments explaining the logic for learners.'
                    }
                  },
                  required: ['filename', 'language', 'code']
                }
              }
            },
            required: ['theory', 'files']
          }
        }
      });

      const response = await model.generateContent(`Explain the following Angular / web development topic with detailed theory and complete runnable code examples: "${query}"`);

      const text = response.response.text();
      if (!text) throw new Error('Empty response from AI.');

      const parsed: AiSearchResult = JSON.parse(text);
      this.result.set(parsed);
      this.state.set('success');
    } catch (err: unknown) {
      const { message, type } = this.parseError(err);
      this.errorMessage.set(message);
      this.errorType.set(type);
      this.state.set('error');
    }
  }

  private parseError(err: unknown): { message: string; type: ErrorType } {
    const raw = err instanceof Error ? err.message : String(err);

    // Extract the JSON body embedded in the SDK error string
    try {
      const jsonStart = raw.indexOf('{');
      if (jsonStart !== -1) {
        const body = JSON.parse(raw.slice(jsonStart));
        const status: string = body?.error?.status ?? body?.status ?? '';
        const code: number = body?.error?.code ?? body?.code ?? 0;
        const retryDetail = body?.error?.details?.find(
          (d: { '@type': string; retryDelay?: string }) =>
            d['@type']?.includes('RetryInfo') && d.retryDelay
        );
        const retrySec = retryDetail?.retryDelay
          ? ` Please retry in ${retryDetail.retryDelay.replace('s', ' seconds')}.`
          : '';

        if (status === 'RESOURCE_EXHAUSTED' || code === 429) {
          return {
            type: 'quota',
            message: `You've hit the Gemini API free-tier rate limit.${retrySec} Consider upgrading your plan or waiting before retrying.`
          };
        }
        if (status === 'PERMISSION_DENIED' || status === 'UNAUTHENTICATED' || code === 401 || code === 403) {
          return { type: 'auth', message: 'API key is invalid or missing. Check the key in environment.ts.' };
        }
        if (status === 'INVALID_ARGUMENT' || code === 400) {
          return { type: 'generic', message: 'The request was malformed. Please rephrase your query and try again.' };
        }
        if (status === 'UNAVAILABLE' || code === 503) {
          return { type: 'network', message: 'The Gemini service is temporarily unavailable. Please try again in a moment.' };
        }
      }
    } catch { /* not JSON — fall through */ }

    // Fallback: classify by keyword in the raw string
    const lower = raw.toLowerCase();
    if (lower.includes('quota') || lower.includes('rate limit') || lower.includes('429') || lower.includes('resource_exhausted'))
      return { type: 'quota', message: 'API rate limit reached. Please wait a moment and try again.' };
    if (lower.includes('api key') || lower.includes('api_key') || lower.includes('401') || lower.includes('403') || lower.includes('permission'))
      return { type: 'auth', message: 'API key is invalid or missing. Check the key in environment.ts.' };
    if (lower.includes('fetch') || lower.includes('network') || lower.includes('net::') || lower.includes('failed to fetch'))
      return { type: 'network', message: 'Network error. Please check your internet connection.' };
    if (lower.includes('empty') || lower.includes('json') || lower.includes('parse'))
      return { type: 'generic', message: 'The AI returned an unexpected response. Please try a different query.' };

    return { type: 'generic', message: 'Something went wrong. Please try again.' };
  }

  reset(): void {
    this.state.set('idle');
    this.result.set(null);
    this.errorMessage.set('');
    this.errorType.set('generic');
  }
}
