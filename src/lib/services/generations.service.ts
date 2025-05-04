import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/db/database.types'
import type { CreateFlashcardDTO, FlashcardResponseDTO } from '@/types'
import { aiService } from './ai.service'
import { errorLoggingService } from './error-logging.service'

export class GenerationsService {
  private readonly errorLogger

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.errorLogger = errorLoggingService(supabase)
  }

  private async createSourceTextHash(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async createGeneration(sourceText: string, model?: string) {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const sourceTextHash = await this.createSourceTextHash(sourceText);

      const { data, error } = await this.supabase
        .from('generations')
        .insert({
          generated_flashcards_count: 0,
          source_text_hash: sourceTextHash,
          user_id: user.id,
          model: model ?? 'gpt-4'
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from generation creation');

      return data;
    } catch (error) {
      await this.errorLogger.logError({
        error_code: 'GENERATION_CREATE_ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        model,
        stack_trace: error instanceof Error ? error.stack : undefined,
      })
      throw error
    }
  }

  async generateFlashcards(sourceText: string, model?: string): Promise<CreateFlashcardDTO[]> {
    try {
      return await aiService.generateFlashcards({ sourceText, model })
    } catch (error) {
      await this.errorLogger.logError({
        error_code: 'FLASHCARD_GENERATION_ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        model,
        stack_trace: error instanceof Error ? error.stack : undefined,
      })
      throw error
    }
  }

  async saveFlashcards(flashcards: CreateFlashcardDTO[], generationId: string): Promise<FlashcardResponseDTO[]> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await this.supabase
        .from('flashcards')
        .insert(
          flashcards.map(flashcard => ({
            front_text: flashcard.front_text,
            back_text: flashcard.back_text,
            generation_id: generationId,
            status: true,
            user_id: user.id
          }))
        )
        .select();

      if (error) throw error;
      if (!data) throw new Error('No data returned from flashcard creation');

      return data;
    } catch (error) {
      await this.errorLogger.logError({
        error_code: 'FLASHCARD_SAVE_ERROR',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        generation_id: generationId,
        stack_trace: error instanceof Error ? error.stack : undefined,
      })
      throw error
    }
  }
}

export const generationsService = (supabase: SupabaseClient<Database>) => new GenerationsService(supabase)
