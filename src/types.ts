import type { Database } from './db/database.types'

// Base types from database
type Tables = Database['public']['Tables']
type Flashcard = Tables['flashcards']['Row']
type Generation = Tables['generations']['Row']
type GenerationErrorLog = Tables['generation_error_logs']['Row']

// Common types
export type FlashcardCreationType = 'ai' | 'manual' | 'ai-edited'

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Flashcard DTOs
export interface FlashcardListRequestDTO extends PaginationParams {
  creation?: FlashcardCreationType
  status?: boolean
  sortBy?: 'created_at' | 'updated_at'
  sortOrder?: 'asc' | 'desc'
}

export type FlashcardResponseDTO = Pick<Flashcard, 'id' | 'front_text' | 'back_text' | 'creation' | 'generation_id' | 'status' | 'created_at' | 'updated_at'>

export type FlashcardListResponseDTO = PaginatedResponse<FlashcardResponseDTO>

// Flashcard Commands
export interface CreateFlashcardDTO {
  front_text: string
  back_text: string
  creation: FlashcardCreationType
  generation_id?: string
}

export interface CreateFlashcardsCommand {
  flashcards: CreateFlashcardDTO[]
}

export interface UpdateFlashcardCommand {
  front_text?: string
  back_text?: string
  status?: boolean
}

// Generation Commands and DTOs
export interface GenerateFlashcardsCommand {
  source_text: string
  model?: string
}

export interface GenerateFlashcardsResponseDTO {
  generation_id: string
  flashcards: FlashcardResponseDTO[]
}

export interface GenerationListRequestDTO extends PaginationParams {
  sortBy?: 'created_at'
  sortOrder?: 'asc' | 'desc'
}

export type GenerationResponseDTO = Omit<Generation, 'user_id'>

export type GenerationListResponseDTO = PaginatedResponse<GenerationResponseDTO>

// Error Log DTOs
export interface ErrorLogListRequestDTO extends PaginationParams {
  error_code?: string
  model?: string
  sortBy?: 'created_at'
  sortOrder?: 'asc' | 'desc'
}

export type ErrorLogResponseDTO = Omit<GenerationErrorLog, 'user_id'>

export type ErrorLogListResponseDTO = PaginatedResponse<ErrorLogResponseDTO>

// Validation constants
export const VALIDATION_CONSTANTS = {
  FLASHCARD_TEXT_MAX_LENGTH: 1000,
  SOURCE_TEXT_MIN_LENGTH: 1000,
  SOURCE_TEXT_MAX_LENGTH: 10000,
} as const 