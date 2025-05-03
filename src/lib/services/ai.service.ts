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
Return response as a JSON array of flashcards with 'front_text' and 'back_text' properties.`

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

    const response = await this.openRouter.chat<CreateFlashcardDTO[]>({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
    })

    console.log('AI response:', response)

    // Validate response structure
    if (!response?.choices?.[0]?.message?.content || !Array.isArray(response.choices[0].message.content)) {
      throw new Error('Invalid response format from AI service')
    }

    // Extract flashcards from response and add creation type
    return response.choices[0].message.content.map(flashcard => ({
      ...flashcard,
      creation: 'ai' as const
    }))
  }
}

export const aiService = new AIService()
