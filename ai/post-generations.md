# API Endpoint Implementation Plan: POST /generations

## 1. Przegląd punktu końcowego
Endpoint służy do generowania fiszek na podstawie dostarczonego tekstu źródłowego przy użyciu AI. Generuje nową generację i powiązane z nią fiszki.

## 2. Szczegóły żądania
- Metoda HTTP: POST
- Struktura URL: `/generations`
- Request Body:
  ```typescript
  {
    source_text: string;  // Required, text from which flashcards will be generated
    model?: string;       // Optional, AI model to use
  }
  ```
- Content-Type: application/json
- Wymagana autoryzacja: Tak (Supabase Auth)

## 3. Wykorzystywane typy
```typescript
// Command
interface GenerateFlashcardsCommand {
  source_text: string;
  model?: string;
}

// Response
interface GenerateFlashcardsResponseDTO {
  generation_id: string;
  flashcards: FlashcardResponseDTO[];
}

// Flashcard DTO used in response
type FlashcardResponseDTO = {
  id: string;
  front_text: string;
  back_text: string;
  creation: FlashcardCreationType;
  generation_id: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}
```

## 4. Przepływ danych
1. Walidacja żądania i danych wejściowych
2. Utworzenie nowego rekordu w tabeli `generations`
3. Wywołanie serwisu AI do generowania fiszek
4. Zapisanie wygenerowanych fiszek w tabeli `flashcards`
5. W przypadku błędu, zapisanie go w tabeli `generation_error_logs`
6. Zwrócenie ID generacji i wygenerowanych fiszek

## 5. Względy bezpieczeństwa
1. Autoryzacja poprzez Supabase Auth
2. Walidacja długości tekstu źródłowego (min: 1000, max: 10000 znaków)
3. Sanityzacja danych wejściowych
4. Rate limiting dla zapobiegania nadużyciom
5. Walidacja modelu AI (jeśli podany)

## 6. Obsługa błędów
- 400 Bad Request
  - Tekst źródłowy jest za krótki lub za długi
  - Nieprawidłowy format danych wejściowych
- 401 Unauthorized
  - Brak lub nieprawidłowy token autoryzacyjny
- 429 Too Many Requests
  - Przekroczony limit żądań
- 500 Internal Server Error
  - Błąd podczas generowania fiszek
  - Błąd podczas zapisu do bazy danych

## 7. Rozważania dotyczące wydajności
1. Asynchroniczne przetwarzanie generacji fiszek
2. Cachowanie wyników dla podobnych tekstów źródłowych
3. Optymalizacja zapytań do bazy danych poprzez batch inserts
4. Monitoring czasu odpowiedzi AI
5. Implementacja kolejkowania żądań przy dużym obciążeniu

## 8. Etapy wdrożenia
1. Utworzenie nowego pliku `src/pages/api/generations.ts`
2. Implementacja walidacji danych wejściowych przy użyciu Zod
3. Utworzenie serwisu `src/lib/services/generations.service.ts`
   - Metoda createGeneration
   - Metoda generateFlashcards
   - Metoda saveFlashcards
4. Implementacja obsługi błędów i logowania z użyciem Supabase Auth
5. Dodanie middleware do autoryzacji
8. Dokumentacja API

## Przykładowa implementacja endpointu

```typescript
// src/pages/api/generations.ts
import type { APIRoute } from 'astro'
import { z } from 'zod'
import { generationsService } from '@/lib/services/generations.service'
import { VALIDATION_CONSTANTS } from '@/types'

const generateSchema = z.object({
  source_text: z.string()
    .min(VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH)
    .max(VALIDATION_CONSTANTS.SOURCE_TEXT_MAX_LENGTH),
  model: z.string().optional()
})

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const json = await request.json()
    const { source_text, model } = generateSchema.parse(json)
    
    const result = await generationsService.generateFlashcards({
      source_text,
      model,
      userId: locals.user.id
    })

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: 'Invalid input data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Log error and return 500
    console.error('Generation error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
```
