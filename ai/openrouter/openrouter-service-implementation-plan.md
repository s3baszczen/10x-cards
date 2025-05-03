# Plan wdrożenia usługi OpenRouter

## 1. Opis usługi

Usługa OpenRouter służy jako warstwa abstrakcji do komunikacji z różnymi modelami AI poprzez API OpenRouter.ai. Umożliwia aplikacji wysyłanie zapytań do różnych modeli językowych (LLM) i odbieranie odpowiedzi, zapewniając jednolity interfejs niezależnie od dostawcy modelu. Usługa ta będzie wykorzystywana do generowania fiszek i innych treści AI w aplikacji 10x-cards.

Główne funkcje:
- Konfiguracja i zarządzanie komunikacją z API OpenRouter
- Obsługa różnych modeli AI dostępnych przez OpenRouter
- Formatowanie zapytań zgodnie z wymaganiami API
- Obsługa odpowiedzi i błędów
- Zarządzanie parametrami modeli

## 2. Opis konstruktora

```typescript
constructor(
  private readonly apiKey: string,
  private readonly defaultModel: string = 'openai/gpt-4o',
  private readonly defaultTemperature: number = 0.7,
  private readonly defaultMaxTokens: number = 1024,
  private readonly baseUrl: string = 'https://openrouter.ai/api/v1'
) {}
```

Konstruktor przyjmuje następujące parametry:
- `apiKey`: Klucz API do usługi OpenRouter (wymagany)
- `defaultModel`: Domyślny model do wykorzystania, jeśli nie zostanie określony inny
- `defaultTemperature`: Domyślna wartość parametru temperature
- `defaultMaxTokens`: Domyślna maksymalna liczba tokenów w odpowiedzi
- `baseUrl`: Bazowy URL API OpenRouter

## 3. Publiczne metody i pola

### 3.1. Metoda `chat`

```typescript
async chat<T = unknown>({
  messages,
  model,
  temperature,
  max_tokens,
  response_format,
  stream = false
}: OpenRouterChatRequest): Promise<OpenRouterChatResponse<T>>
```

Główna metoda do komunikacji z modelami AI poprzez endpoint chat. Przyjmuje następujące parametry:
- `messages`: Tablica wiadomości w formacie zgodnym z API OpenRouter
- `model`: Nazwa modelu do wykorzystania (opcjonalnie, domyślnie używa wartości z konstruktora)
- `temperature`: Parametr temperature dla modelu (opcjonalnie)
- `max_tokens`: Maksymalna liczba tokenów w odpowiedzi (opcjonalnie)
- `response_format`: Format odpowiedzi, np. dla strukturyzowanych odpowiedzi JSON (opcjonalnie)
- `stream`: Czy odpowiedź ma być strumieniowana (opcjonalnie, domyślnie false)

Zwraca obiekt typu `OpenRouterChatResponse<T>`, gdzie T to typ danych w przypadku strukturyzowanej odpowiedzi.

### 3.2. Metoda `streamChat`

```typescript
async *streamChat<T = unknown>({
  messages,
  model,
  temperature,
  max_tokens,
  response_format
}: OpenRouterChatRequest): AsyncGenerator<OpenRouterChatStreamChunk<T>>
```

Metoda do strumieniowania odpowiedzi z modeli AI. Przyjmuje te same parametry co metoda `chat`, ale zwraca generator asynchroniczny, który emituje fragmenty odpowiedzi w miarę ich otrzymywania.

### 3.3. Metoda `generateFlashcards`

```typescript
async generateFlashcards({
  sourceText,
  model
}: FlashcardGenerationPrompt): Promise<CreateFlashcardDTO[]>
```

Specjalizowana metoda do generowania fiszek na podstawie tekstu źródłowego. Wykorzystuje metodę `chat` z odpowiednim formatem odpowiedzi JSON.

## 4. Prywatne metody i pola

### 4.1. Metoda `buildHeaders`

```typescript
private buildHeaders(): Record<string, string>
```

Tworzy nagłówki HTTP wymagane przez API OpenRouter, w tym nagłówek autoryzacji z kluczem API.

### 4.2. Metoda `buildRequestBody`

```typescript
private buildRequestBody<T>({
  messages,
  model,
  temperature,
  max_tokens,
  response_format,
  stream
}: OpenRouterChatRequest): OpenRouterChatRequestBody
```

Buduje ciało żądania zgodnie z wymaganiami API OpenRouter, uwzględniając wszystkie parametry i stosując wartości domyślne tam, gdzie to konieczne.

### 4.3. Metoda `handleError`

```typescript
private handleError(error: unknown): never
```

Przetwarza błędy HTTP i inne wyjątki, formatując je w sposób zgodny z systemem obsługi błędów aplikacji.

### 4.4. Metoda `parseStreamChunk`

```typescript
private parseStreamChunk<T>(chunk: string): OpenRouterChatStreamChunk<T>
```

Przetwarza pojedynczy fragment strumieniowanej odpowiedzi z formatu SSE (Server-Sent Events) do obiektu JavaScript.

## 5. Obsługa błędów

Usługa OpenRouter implementuje kompleksową obsługę błędów, obejmującą:

1. Błędy autoryzacji (nieprawidłowy klucz API)
2. Błędy limitów (przekroczenie limitu zapytań)
3. Błędy modelu (niedostępny model, nieprawidłowe parametry)
4. Błędy sieci (timeout, problemy z połączeniem)
5. Błędy parsowania odpowiedzi

Każdy błąd jest przetwarzany przez metodę `handleError`, która:
- Klasyfikuje błąd według typu
- Dodaje kontekst (np. nazwę modelu, parametry zapytania)
- Loguje błąd za pomocą `errorLoggingService`
- Rzuca odpowiedni wyjątek z informatywnym komunikatem

## 6. Kwestie bezpieczeństwa

1. Bezpieczne przechowywanie klucza API:
   - Klucz API powinien być przechowywany w zmiennych środowiskowych
   - Nigdy nie powinien być umieszczany bezpośrednio w kodzie
   - Powinien być przekazywany do usługi w bezpieczny sposób

2. Walidacja danych wejściowych:
   - Wszystkie dane wejściowe powinny być walidowane przed wysłaniem do API
   - Należy stosować limity na długość tekstu wejściowego
   - Należy filtrować potencjalnie niebezpieczne dane wejściowe

3. Obsługa danych wyjściowych:
   - Odpowiedzi z modeli AI powinny być traktowane jako potencjalnie niebezpieczne
   - Należy implementować dodatkowe walidacje dla odpowiedzi modeli
   - W przypadku strukturyzowanych odpowiedzi, należy zawsze walidować je względem schematu

4. Limity i monitorowanie:
   - Implementacja limitów na liczbę zapytań
   - Monitorowanie kosztów i wykorzystania API
   - Alerty przy nietypowym wykorzystaniu

## 7. Plan wdrożenia krok po kroku

### Krok 1: Utworzenie pliku usługi

Utwórz plik `src/lib/services/openrouter.service.ts` z podstawową strukturą klasy:

```typescript
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/db/database.types'
import type { CreateFlashcardDTO } from '@/types'
import { errorLoggingService } from './error-logging.service'

// Typy dla OpenRouter
export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string
  name?: string
}

export interface OpenRouterChatRequest {
  messages: OpenRouterMessage[]
  model?: string
  temperature?: number
  max_tokens?: number
  response_format?: {
    type: 'json_schema'
    schema: Record<string, unknown>
  }
  stream?: boolean
}

export interface OpenRouterChatResponse<T = unknown> {
  id: string
  model: string
  choices: {
    message: {
      role: string
      content: string
      tool_calls?: any[]
    }
    finish_reason: string
    index: number
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  parsed_response?: T
}

export interface OpenRouterChatStreamChunk<T = unknown> {
  id: string
  model: string
  choices: {
    delta: {
      role?: string
      content?: string
      tool_calls?: any[]
    }
    finish_reason: string | null
    index: number
  }[]
  parsed_chunk?: Partial<T>
}

export class OpenRouterService {
  private readonly errorLogger

  constructor(
    private readonly supabase: SupabaseClient<Database>,
    private readonly apiKey: string,
    private readonly defaultModel: string = 'openai/gpt-4o',
    private readonly defaultTemperature: number = 0.7,
    private readonly defaultMaxTokens: number = 1024,
    private readonly baseUrl: string = 'https://openrouter.ai/api/v1'
  ) {
    this.errorLogger = errorLoggingService(supabase)
  }

  // Implementacja metod...
}

export const openRouterService = (
  supabase: SupabaseClient<Database>,
  apiKey: string,
  defaultModel?: string,
  defaultTemperature?: number,
  defaultMaxTokens?: number,
  baseUrl?: string
) => new OpenRouterService(
  supabase,
  apiKey,
  defaultModel,
  defaultTemperature,
  defaultMaxTokens,
  baseUrl
)
```

### Krok 2: Implementacja metod prywatnych

Dodaj prywatne metody pomocnicze:

```typescript
private buildHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.apiKey}`,
    'HTTP-Referer': 'https://10xcards.app', // Domena aplikacji
    'X-Title': '10x Cards' // Nazwa aplikacji
  }
}

private buildRequestBody({
  messages,
  model = this.defaultModel,
  temperature = this.defaultTemperature,
  max_tokens = this.defaultMaxTokens,
  response_format,
  stream = false
}: OpenRouterChatRequest): Record<string, unknown> {
  return {
    messages,
    model,
    temperature,
    max_tokens,
    response_format,
    stream
  }
}

private handleError(error: unknown, context: Record<string, unknown> = {}): never {
  const errorCode = 'OPENROUTER_API_ERROR'
  let errorMessage = 'Unknown error occurred while communicating with OpenRouter API'
  let stackTrace: string | undefined

  if (error instanceof Error) {
    errorMessage = error.message
    stackTrace = error.stack
  } else if (typeof error === 'string') {
    errorMessage = error
  }

  this.errorLogger.logError({
    error_code: errorCode,
    error_message: errorMessage,
    model: context.model as string | undefined,
    stack_trace: stackTrace
  })

  throw new Error(`${errorCode}: ${errorMessage}`)
}

private parseStreamChunk<T>(chunk: string): OpenRouterChatStreamChunk<T> | null {
  if (!chunk || chunk === '[DONE]') return null

  try {
    const data = JSON.parse(chunk.replace(/^data: /, '').trim())
    return data
  } catch (error) {
    this.handleError(error, { chunk })
  }
}
```

### Krok 3: Implementacja metody chat

Dodaj główną metodę do komunikacji z API:

```typescript
async chat<T = unknown>({
  messages,
  model = this.defaultModel,
  temperature = this.defaultTemperature,
  max_tokens = this.defaultMaxTokens,
  response_format,
  stream = false
}: OpenRouterChatRequest): Promise<OpenRouterChatResponse<T>> {
  try {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify(this.buildRequestBody({
        messages,
        model,
        temperature,
        max_tokens,
        response_format,
        stream
      }))
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`API error (${response.status}): ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json() as OpenRouterChatResponse<T>

    // Jeśli mamy response_format typu json_schema, spróbuj sparsować odpowiedź
    if (response_format?.type === 'json_schema' && data.choices[0]?.message.content) {
      try {
        const parsedContent = JSON.parse(data.choices[0].message.content)
        data.parsed_response = parsedContent as T
      } catch (error) {
        this.handleError(new Error('Failed to parse JSON response from model'), {
          model,
          content: data.choices[0]?.message.content
        })
      }
    }

    return data
  } catch (error) {
    return this.handleError(error, { model, messages })
  }
}
```

### Krok 4: Implementacja metody streamChat

Dodaj metodę do strumieniowania odpowiedzi:

```typescript
async *streamChat<T = unknown>({
  messages,
  model = this.defaultModel,
  temperature = this.defaultTemperature,
  max_tokens = this.defaultMaxTokens,
  response_format
}: OpenRouterChatRequest): AsyncGenerator<OpenRouterChatStreamChunk<T>> {
  try {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify(this.buildRequestBody({
        messages,
        model,
        temperature,
        max_tokens,
        response_format,
        stream: true
      }))
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`API error (${response.status}): ${errorData.error?.message || response.statusText}`)
    }

    if (!response.body) {
      throw new Error('Response body is null')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.trim() === '' || line.trim() === 'data: [DONE]') continue
          if (!line.startsWith('data: ')) continue

          const chunk = this.parseStreamChunk<T>(line)
          if (chunk) yield chunk
        }
      }
    } finally {
      reader.releaseLock()
    }
  } catch (error) {
    this.handleError(error, { model, messages })
  }
}
```

### Krok 5: Implementacja metody generateFlashcards

Dodaj specjalizowaną metodę do generowania fiszek:

```typescript
async generateFlashcards({
  sourceText,
  model = this.defaultModel
}: {
  sourceText: string
  model?: string
}): Promise<CreateFlashcardDTO[]> {
  try {
    // Schemat JSON dla odpowiedzi
    const responseSchema = {
      type: 'object',
      properties: {
        flashcards: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              front_text: { type: 'string' },
              back_text: { type: 'string' }
            },
            required: ['front_text', 'back_text']
          }
        }
      },
      required: ['flashcards']
    }

    // Przygotowanie wiadomości systemowej i użytkownika
    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: `Jesteś ekspertem w tworzeniu fiszek edukacyjnych. Twoim zadaniem jest przekształcenie podanego tekstu w zestaw fiszek, które pomogą w nauce. Każda fiszka powinna zawierać pytanie (front_text) i odpowiedź (back_text). Pytania powinny być zwięzłe i konkretne. Odpowiedzi powinny być kompletne, ale nie dłuższe niż 2-3 zdania. Utwórz 5-10 fiszek w zależności od długości i złożoności tekstu.`
      },
      {
        role: 'user',
        content: sourceText
      }
    ]

    // Wywołanie API z formatem odpowiedzi JSON
    const response = await this.chat<{ flashcards: { front_text: string, back_text: string }[] }>({
      messages,
      model,
      temperature: 0.7,
      max_tokens: 2048,
      response_format: {
        type: 'json_schema',
        schema: responseSchema
      }
    })

    // Sprawdzenie czy mamy sparsowaną odpowiedź
    if (!response.parsed_response?.flashcards) {
      throw new Error('Failed to generate flashcards: Invalid response format')
    }

    // Mapowanie odpowiedzi na format DTO
    return response.parsed_response.flashcards.map(flashcard => ({
      front_text: flashcard.front_text,
      back_text: flashcard.back_text,
      creation: 'ai'
    }))
  } catch (error) {
    return this.handleError(error, { model, sourceTextLength: sourceText.length })
  }
}
```

### Krok 6: Aktualizacja zmiennych środowiskowych

Dodaj klucz API OpenRouter do pliku `.env`:

```
OPENROUTER_API_KEY=your_api_key_here
```

I zaktualizuj plik `src/env.d.ts`, aby uwzględnić nową zmienną:

```typescript
interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string
  readonly PUBLIC_SUPABASE_ANON_KEY: string
  readonly OPENROUTER_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### Krok 7: Integracja z istniejącą usługą AI

Zaktualizuj plik `src/lib/services/ai.service.ts`, aby korzystał z nowej usługi OpenRouter:

```typescript
import type { CreateFlashcardDTO } from '@/types'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/db/database.types'
import { openRouterService } from './openrouter.service'

interface FlashcardGenerationPrompt {
  sourceText: string
  model?: string
}

export class AIService {
  private readonly openRouter

  constructor(
    private readonly supabase: SupabaseClient<Database>,
    private readonly openRouterApiKey: string
  ) {
    this.openRouter = openRouterService(supabase, openRouterApiKey)
  }

  async generateFlashcards({ sourceText, model }: FlashcardGenerationPrompt): Promise<CreateFlashcardDTO[]> {
    return this.openRouter.generateFlashcards({ sourceText, model })
  }
}

export const aiService = (
  supabase: SupabaseClient<Database>,
  openRouterApiKey: string
) => new AIService(supabase, openRouterApiKey)
```

### Krok 8: Aktualizacja fabryki usługi AI w endpointach API

Zaktualizuj endpoint API do generowania fiszek, aby korzystał z nowej usługi:

```typescript
import type { APIRoute } from 'astro'
import { createClient } from '@/db/supabase.server'
import { aiService } from '@/lib/services/ai.service'
import { generationsService } from '@/lib/services/generations.service'
import { z } from 'zod'
import { VALIDATION_CONSTANTS } from '@/types'

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const supabase = locals.supabase || createClient()
    const ai = aiService(supabase, import.meta.env.OPENROUTER_API_KEY)
    const generations = generationsService(supabase)

    // Walidacja danych wejściowych...
    const body = await request.json()
    
    const schema = z.object({
      source_text: z.string()
        .min(VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH, 'Text is too short')
        .max(VALIDATION_CONSTANTS.SOURCE_TEXT_MAX_LENGTH, 'Text is too long'),
      model: z.string().optional()
    })

    const { source_text, model } = schema.parse(body)

    // Tworzenie generacji...
    const generation = await generations.createGeneration(source_text, model)

    // Generowanie fiszek...
    const flashcards = await ai.generateFlashcards({ 
      sourceText: source_text, 
      model 
    })

    // Zapisywanie fiszek...
    const savedFlashcards = await generations.saveFlashcards(
      flashcards.map(f => ({ ...f, generation_id: generation.id })),
      generation.id
    )

    return new Response(
      JSON.stringify({
        generation_id: generation.id,
        flashcards: savedFlashcards
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating flashcards:', error)
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Validation error', details: error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Failed to generate flashcards' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
```

### Krok 9: Testowanie

1. Utwórz testy jednostkowe dla usługi OpenRouter:
   - Test konstruktora i inicjalizacji
   - Test metody chat z różnymi parametrami
   - Test metody generateFlashcards
   - Testy obsługi błędów

2. Utwórz testy integracyjne:
   - Test integracji z usługą AI
   - Test integracji z endpointami API

3. Wykonaj testy manualne:
   - Test generowania fiszek z różnymi modelami
   - Test obsługi błędów w interfejsie użytkownika

### Krok 10: Dokumentacja

1. Dodaj komentarze JSDoc do wszystkich metod i klas
2. Utwórz dokumentację API dla zespołu
3. Dodaj przykłady użycia do README projektu

## Przykłady użycia

### Przykład 1: Podstawowe użycie metody chat

```typescript
const response = await openRouter.chat({
  messages: [
    { role: 'system', content: 'Jesteś pomocnym asystentem.' },
    { role: 'user', content: 'Jak działa TypeScript?' }
  ],
  model: 'anthropic/claude-3-opus'
})

console.log(response.choices[0].message.content)
```

### Przykład 2: Użycie response_format dla strukturyzowanych odpowiedzi

```typescript
const schema = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    keyPoints: { type: 'array', items: { type: 'string' } }
  },
  required: ['summary', 'keyPoints']
}

const response = await openRouter.chat<{ summary: string, keyPoints: string[] }>({
  messages: [
    { role: 'system', content: 'Jesteś pomocnym asystentem.' },
    { role: 'user', content: 'Podsumuj kluczowe cechy TypeScript.' }
  ],
  response_format: {
    type: 'json_schema',
    schema
  }
})

if (response.parsed_response) {
  console.log('Summary:', response.parsed_response.summary)
  console.log('Key Points:', response.parsed_response.keyPoints)
}
```

### Przykład 3: Strumieniowanie odpowiedzi

```typescript
const stream = openRouter.streamChat({
  messages: [
    { role: 'system', content: 'Jesteś pomocnym asystentem.' },
    { role: 'user', content: 'Napisz krótkie opowiadanie o programiście.' }
  ]
})

let fullResponse = ''
for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta.content || ''
  fullResponse += content
  console.log(content) // Wyświetlanie fragmentów w czasie rzeczywistym
}

console.log('Full response:', fullResponse)
```

### Przykład 4: Generowanie fiszek

```typescript
const flashcards = await openRouter.generateFlashcards({
  sourceText: 'TypeScript to język programowania stworzony przez Microsoft...',
  model: 'openai/gpt-4o'
})

console.log('Generated flashcards:', flashcards)
```
