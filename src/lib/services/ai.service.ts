import type { CreateFlashcardDTO } from '@/types'
import { OpenRouterService } from '../openrouter.service'
import { VALIDATION_CONSTANTS } from '@/types'
import { AI_CONFIG, type OpenRouterModel } from '../config/ai.config'

interface FlashcardGenerationPrompt {
  sourceText: string
  model?: OpenRouterModel
}

const SYSTEM_PROMPT = `You are a helpful AI that generates flashcards from provided text. 
Create concise, clear flashcards that help with learning and memorization.
Each flashcard should have a question on the front and a clear, concise answer on the back.
Ensure questions are specific and answers are focused and accurate.
Keep both front_text and back_text under ${VALIDATION_CONSTANTS.FLASHCARD_TEXT_MAX_LENGTH} characters.
Return response as a JSON object with a 'flashcards' array containing objects with 'front_text' and 'back_text' properties.`

export class AIService {
  private readonly openRouter: OpenRouterService

  constructor() {
    if (!import.meta.env.OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY environment variable is required')
    }
    this.openRouter = new OpenRouterService(
      import.meta.env.OPENROUTER_API_KEY,
      AI_CONFIG.openrouter.defaultModel,
      AI_CONFIG.openrouter.temperature,
      AI_CONFIG.openrouter.maxTokens,
      AI_CONFIG.openrouter.baseUrl
    )
  }

  async generateFlashcards({ sourceText, model = AI_CONFIG.openrouter.defaultModel as OpenRouterModel }: FlashcardGenerationPrompt): Promise<CreateFlashcardDTO[]> {
    // Validate source text length
    if (sourceText.length < VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH || 
        sourceText.length > VALIDATION_CONSTANTS.SOURCE_TEXT_MAX_LENGTH) {
      throw new Error(`Source text must be between ${VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH} and ${VALIDATION_CONSTANTS.SOURCE_TEXT_MAX_LENGTH} characters`)
    }

    const userPrompt = `Generate flashcards from the following text:\n\n${sourceText}`

    const response = await this.openRouter.chat<{flashcards: CreateFlashcardDTO[]} | string>({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      model,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'flashcards',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              flashcards: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    front_text: { 
                      type: 'string', 
                      description: 'The question or prompt on the front of the flashcard'
                    },
                    back_text: { 
                      type: 'string', 
                      description: 'The answer or information on the back of the flashcard'
                    }
                  },
                  required: ['front_text', 'back_text'],
                  additionalProperties: false
                }
              }
            },
            required: ['flashcards'],
            additionalProperties: false
          }
        }
      }
    })

    console.dir(response, { depth: null })

    let content: {flashcards: CreateFlashcardDTO[]}
    
    // Handle content based on its type
    if (typeof response?.choices?.[0]?.message?.content === 'string') {
      try {
        // Try to parse the string as JSON
        content = JSON.parse(response.choices[0].message.content as string)
      } catch (e) {
        console.error('Failed to parse response as JSON:', e)
        throw new Error('Failed to parse AI response as JSON')
      }
    } else {
      // It's already an object
      content = response?.choices?.[0]?.message?.content as {flashcards: CreateFlashcardDTO[]}
    }
    
    // Validate response structure
    if (!content?.flashcards || !Array.isArray(content.flashcards)) {
      console.error('Invalid response structure:', content)
      throw new Error('Invalid response format from AI service')
    }

    // Extract flashcards from response and add creation type
    const flashcards = content.flashcards.map(flashcard => ({
      ...flashcard,
      creation: 'ai' as const
    }))
    
    // Validate flashcard lengths after receiving
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

    return flashcards
  }
}

export const aiService = new AIService()
