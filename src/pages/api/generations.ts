import type { APIRoute } from 'astro'
import { z } from 'zod'
import { generationsService } from '@/lib/services/generations.service'
import { VALIDATION_CONSTANTS } from '@/types'

export const prerender = false

class GenerationError extends Error {
  constructor(message: string, public status: number = 500) {
    super(message)
    this.name = 'GenerationError'
  }
}

const generateSchema = z.object({
  source_text: z
    .string()
    .min(VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH, `Text must be at least ${VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH} characters long`)
    .max(VALIDATION_CONSTANTS.SOURCE_TEXT_MAX_LENGTH, `Text must not exceed ${VALIDATION_CONSTANTS.SOURCE_TEXT_MAX_LENGTH} characters`),
  model: z.string().optional(),
})

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    if (!locals.supabase) {
      throw new GenerationError('Database connection not available', 503)
    }

    const body = await request.json()
    const validationResult = generateSchema.safeParse(body)

    if (!validationResult.success) {
      return new Response(JSON.stringify({ 
        error: 'Validation failed',
        details: validationResult.error.errors 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { source_text, model } = validationResult.data
    const service = generationsService(locals.supabase)

    // Create generation record
    const generation = await service.createGeneration(source_text, model)
      .catch(error => {
        throw new GenerationError('Failed to create generation record: ' + error.message, 500)
      })

    // Generate flashcards using AI
    const generatedFlashcards = await service.generateFlashcards(source_text, model)
      .catch(error => {
        throw new GenerationError('Failed to generate flashcards: ' + error.message, 500)
      })

    // Save flashcards
    const savedFlashcards = await service.saveFlashcards(generatedFlashcards, generation.id)
      .catch(error => {
        throw new GenerationError('Failed to save flashcards: ' + error.message, 500)
      })

    return new Response(
      JSON.stringify({
        generation_id: generation.id,
        flashcards: savedFlashcards,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in flashcard generation:', error)
    
    if (error instanceof GenerationError) {
      return new Response(JSON.stringify({ 
        error: error.message 
      }), {
        status: error.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    return new Response(JSON.stringify({ 
      error: 'An unexpected error occurred during flashcard generation' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
