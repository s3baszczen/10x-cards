import type { APIRoute } from 'astro'
import { z } from 'zod'
import { generationsService } from '@/lib/services/generations.service'
import { VALIDATION_CONSTANTS } from '@/types'

export const prerender = false

const flashcardSchema = z.object({
  front_text: z
    .string()
    .min(1, 'Front text is required')
    .max(VALIDATION_CONSTANTS.FLASHCARD_TEXT_MAX_LENGTH, `Front text must not exceed ${VALIDATION_CONSTANTS.FLASHCARD_TEXT_MAX_LENGTH} characters`),
  back_text: z
    .string()
    .min(1, 'Back text is required')
    .max(VALIDATION_CONSTANTS.FLASHCARD_TEXT_MAX_LENGTH, `Back text must not exceed ${VALIDATION_CONSTANTS.FLASHCARD_TEXT_MAX_LENGTH} characters`),
})

const saveAcceptedFlashcardsSchema = z.object({
  flashcards: z.array(flashcardSchema),
  generation_id: z.string().uuid('Invalid generation ID'),
})

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json()
    const validationResult = saveAcceptedFlashcardsSchema.safeParse(body)

    if (!validationResult.success) {
      return new Response(JSON.stringify({ error: validationResult.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { flashcards, generation_id } = validationResult.data
    const service = generationsService(locals.supabase)

    const savedFlashcards = await service.saveAcceptedFlashcards(flashcards, generation_id)

    return new Response(JSON.stringify(savedFlashcards), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error saving flashcards:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred while saving flashcards',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const creation = url.searchParams.get('creation') as FlashcardCreationType | undefined;
    const status = url.searchParams.get('status') === 'true' ? true : undefined;
    const sortBy = url.searchParams.get('sortBy') as 'created_at' | 'updated_at' | undefined;
    const sortOrder = url.searchParams.get('sortOrder') as 'asc' | 'desc' | undefined;

    const service = generationsService(locals.supabase);
    const flashcards = await service.getFlashcards({
      page,
      limit,
      creation,
      status,
      sortBy,
      sortOrder,
    });

    return new Response(JSON.stringify(flashcards), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred while fetching flashcards',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
