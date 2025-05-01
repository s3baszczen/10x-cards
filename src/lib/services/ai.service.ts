import type { CreateFlashcardDTO } from '@/types'

interface FlashcardGenerationPrompt {
  sourceText: string
  model?: string
}

export class AIService {
  async generateFlashcards({ sourceText, model = 'gpt-4' }: FlashcardGenerationPrompt): Promise<CreateFlashcardDTO[]> {
    // TODO: Implement actual OpenAI integration
    // For now returning mock data
    return [
      {
        front_text: 'What is TypeScript?',
        back_text: 'TypeScript is a strongly typed programming language that builds on JavaScript.',
        creation: 'ai',
      },
      {
        front_text: 'What are generics in TypeScript?',
        back_text: 'Generics allow you to write flexible, reusable functions and classes that can work with multiple types.',
        creation: 'ai',
      },
    ]
  }
}

export const aiService = new AIService()
