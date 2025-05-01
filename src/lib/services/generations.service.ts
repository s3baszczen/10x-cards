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

  async createGeneration(sourceText: string, model?: string) {
    try {
      // Mock generation creation
      return {
        id: 'mock-generation-id',
        source_text: sourceText,
        model: model ?? 'gpt-4',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'mock-user-id',
      }
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
      // Mock saving flashcards
      return flashcards.map((flashcard, index) => ({
        id: `mock-flashcard-id-${index + 1}`,
        ...flashcard,
        generation_id: generationId,
        status: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))
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
