import type { CreateFlashcardDTO } from '@/types'
import { delay } from '@/lib/utils/time'
import { MOCK_FLASHCARDS } from '@/lib/constants/mockFlashcards'

interface FlashcardGenerationPrompt {
  sourceText: string
  model?: string
}

export class AIService {
  private static instance: AIService

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  async generateFlashcards({ sourceText, model = 'gpt-4' }: FlashcardGenerationPrompt): Promise<CreateFlashcardDTO[]> {
    // Symulowanie procesu przetwarzania AI z opóźnieniem zależnym od długości tekstu
    const processingTime = Math.min(3000, Math.max(1000, sourceText.length / 20))
    await delay(processingTime)

    // Losowa liczba fiszek zależna od długości tekstu (ale zawsze co najmniej 5)
    const flashcardCount = Math.max(5, Math.min(15, Math.floor(sourceText.length / 500)))
    
    const category = this.determineCategory(sourceText)
    return this.getMockFlashcards(category, flashcardCount)
  }

  private determineCategory(sourceText: string): string {
    const text = sourceText.toLowerCase()
    
    if (text.includes('javascript') || text.includes('typescript')) {
      return 'programming'
    }
    
    if (text.includes('historia') || text.includes('history')) {
      return 'history'
    }
    
    if (text.includes('biologia') || text.includes('biology')) {
      return 'biology'
    }
    
    return 'general'
  }

  private getMockFlashcards(category: string, count: number): CreateFlashcardDTO[] {
    const availableFlashcards = category in MOCK_FLASHCARDS
      ? [...MOCK_FLASHCARDS[category], ...MOCK_FLASHCARDS.general]
      : [...MOCK_FLASHCARDS.general]
    
    // Jeśli mamy za mało fiszek w kategorii, uzupełniamy ogólnymi
    while (availableFlashcards.length < count) {
      availableFlashcards.push(...MOCK_FLASHCARDS.general)
    }
    
    // Wybieranie losowych fiszek
    return [...availableFlashcards]
      .sort(() => 0.5 - Math.random())
      .slice(0, count)
  }
}

export const aiService = AIService.getInstance()
