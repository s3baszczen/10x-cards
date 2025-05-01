import type { APIRoute } from 'astro'
import { z } from 'zod'
import { generationsService } from '@/lib/services/generations.service'
import { VALIDATION_CONSTANTS } from '@/types'

export const prerender = false

const generateSchema = z.object({
  source_text: z
    .string()
    .min(VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH, `Text must be at least ${VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH} characters long`)
    .max(VALIDATION_CONSTANTS.SOURCE_TEXT_MAX_LENGTH, `Text must not exceed ${VALIDATION_CONSTANTS.SOURCE_TEXT_MAX_LENGTH} characters`),
  model: z.string().optional(),
})

export const POST: APIRoute = async ({ request, locals }) => {
  try {

    const body = await request.json()
    const validationResult = generateSchema.safeParse(body)

    if (!validationResult.success) {
      return new Response(JSON.stringify({ error: validationResult.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { source_text, model } = validationResult.data
    const service = generationsService(locals.supabase)

    // Create generation record
    const generation = await service.createGeneration(source_text, model)

    // Generate flashcards using AI
    const generatedFlashcards = await service.generateFlashcards(source_text, model)

    // Save flashcards
    const savedFlashcards = await service.saveFlashcards(generatedFlashcards, generation.id)

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
    console.error('Error generating flashcards:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
