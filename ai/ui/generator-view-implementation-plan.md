# Plan implementacji widoku Generator AI

## 1. Przegląd
Generator AI to widok umożliwiający użytkownikom generowanie fiszek na podstawie wprowadzonego tekstu. Pozwala na wprowadzenie tekstu źródłowego, uruchomienie procesu generowania przy użyciu AI, a następnie przeglądanie, edytowanie, akceptowanie lub odrzucanie wygenerowanych propozycji fiszek przed ich zapisaniem do bazy danych.

## 2. Routing widoku
Widok będzie dostępny pod dwoma ścieżkami:
- `/generate` - jako samodzielna strona
- Jako modal w widoku `/flashcards` (dostępny poprzez przycisk "Generuj fiszki")

## 3. Struktura komponentów
```
GeneratorView
├── TextInputSection
│   ├── TextArea (z licznikiem znaków i walidacją)
│   └── GenerateButton
├── GenerationStatus
│   └── ProgressIndicator
└── ProposalList
    ├── ProposalItem
    │   ├── FlashcardPreview
    │   └── ActionButtons (akceptuj/odrzuć/edytuj)
    └── SaveAcceptedButton
```

## 4. Szczegóły komponentów

### GeneratorView
- **Opis komponentu**: Główny kontener widoku generatora, który zarządza stanem całego procesu generowania i wyświetla odpowiednie sekcje w zależności od etapu procesu.
- **Główne elementy**: Container z nagłówkiem, TextInputSection, GenerationStatus, ProposalList
- **Obsługiwane interakcje**: Zarządzanie przejściami między stanami (wprowadzanie tekstu -> generowanie -> przeglądanie propozycji)
- **Obsługiwana walidacja**: N/A (delegowana do komponentów potomnych)
- **Typy**: `GeneratorViewState`, `GenerateFlashcardsCommand`, `GenerateFlashcardsResponseDTO`
- **Propsy**: `isModal?: boolean` (określa, czy komponent jest renderowany jako modal)

### TextInputSection
- **Opis komponentu**: Sekcja zawierająca pole tekstowe do wprowadzania tekstu źródłowego oraz przycisk do uruchomienia generowania.
- **Główne elementy**: Label, TextArea, CharacterCounter, ValidationMessage, GenerateButton
- **Obsługiwane interakcje**: 
  - Wprowadzanie tekstu
  - Kliknięcie przycisku "Generuj"
- **Obsługiwana walidacja**: 
  - Długość tekstu (min. 1000, maks. 10000 znaków)
  - Blokada przycisku "Generuj", gdy tekst nie spełnia wymagań
- **Typy**: `TextInputSectionProps`, `GenerateFlashcardsCommand`
- **Propsy**: 
  ```typescript
  {
    sourceText: string;
    onSourceTextChange: (text: string) => void;
    onGenerateClick: () => void;
    isGenerating: boolean;
    validationError?: string;
  }
  ```

### GenerationStatus
- **Opis komponentu**: Wyświetla status procesu generowania fiszek, w tym pasek postępu i komunikaty.
- **Główne elementy**: ProgressIndicator, StatusMessage
- **Obsługiwane interakcje**: N/A (komponent informacyjny)
- **Obsługiwana walidacja**: N/A
- **Typy**: `GenerationStatusProps`
- **Propsy**: 
  ```typescript
  {
    isGenerating: boolean;
    progress?: number; // opcjonalnie, jeśli API dostarcza informacje o postępie
    statusMessage?: string;
  }
  ```

### ProposalList
- **Opis komponentu**: Lista wygenerowanych propozycji fiszek z możliwością akceptacji, odrzucenia lub edycji każdej z nich.
- **Główne elementy**: Lista ProposalItem, SaveAcceptedButton
- **Obsługiwane interakcje**: 
  - Zapisanie zaakceptowanych fiszek
  - Delegowanie interakcji do komponentów ProposalItem
- **Obsługiwana walidacja**: Sprawdzanie, czy istnieje co najmniej jedna zaakceptowana fiszka przed zapisem
- **Typy**: `ProposalListProps`, `FlashcardProposal[]`
- **Propsy**: 
  ```typescript
  {
    proposals: FlashcardProposal[];
    onProposalAction: (id: string, action: 'accept' | 'reject' | 'edit', updatedProposal?: FlashcardProposal) => void;
    onSaveAccepted: () => void;
    isSaving: boolean;
  }
  ```

### ProposalItem
- **Opis komponentu**: Pojedyncza propozycja fiszki z podglądem pytania i odpowiedzi oraz przyciskami akcji.
- **Główne elementy**: FlashcardPreview, ActionButtons (Accept, Reject, Edit)
- **Obsługiwane interakcje**: 
  - Akceptacja propozycji
  - Odrzucenie propozycji
  - Otwarcie trybu edycji
- **Obsługiwana walidacja**: N/A
- **Typy**: `ProposalItemProps`, `FlashcardProposal`
- **Propsy**: 
  ```typescript
  {
    proposal: FlashcardProposal;
    onAction: (action: 'accept' | 'reject' | 'edit', updatedProposal?: FlashcardProposal) => void;
  }
  ```

### FlashcardPreview
- **Opis komponentu**: Wyświetla podgląd fiszki (przód i tył) w formie karty.
- **Główne elementy**: Card z sekcjami Front i Back
- **Obsługiwane interakcje**: Opcjonalnie przełączanie między przodem a tyłem fiszki
- **Obsługiwana walidacja**: N/A
- **Typy**: `FlashcardPreviewProps`
- **Propsy**: 
  ```typescript
  {
    frontText: string;
    backText: string;
    isEditable?: boolean;
    onEdit?: (field: 'front' | 'back', value: string) => void;
  }
  ```

## 5. Typy

```typescript
// Stan widoku generatora
interface GeneratorViewState {
  step: 'input' | 'generating' | 'review';
  sourceText: string;
  validationError?: string;
  generationId?: string;
  proposals: FlashcardProposal[];
  isGenerating: boolean;
  isSaving: boolean;
  error?: string;
}

// Model propozycji fiszki
interface FlashcardProposal {
  id: string; // Tymczasowe ID na froncie
  frontText: string;
  backText: string;
  status: 'pending' | 'accepted' | 'rejected';
  isEditing?: boolean;
}

// Mapowanie propozycji na DTO do zapisu
interface FlashcardToSave {
  front_text: string;
  back_text: string;
  creation: 'ai';
  generation_id: string;
}

// Dane formularza edycji
interface EditFlashcardFormData {
  frontText: string;
  backText: string;
}
```

## 6. Zarządzanie stanem

Dla tego widoku zalecane jest utworzenie customowego hooka `useGeneratorState`, który będzie zarządzał całym procesem generowania fiszek:

```typescript
function useGeneratorState() {
  const [state, setState] = useState<GeneratorViewState>({
    step: 'input',
    sourceText: '',
    proposals: [],
    isGenerating: false,
    isSaving: false
  });

  // Funkcje zarządzające stanem
  const setSourceText = (text: string) => {...};
  const startGeneration = async () => {...};
  const handleProposalAction = (id: string, action: 'accept' | 'reject' | 'edit', updatedProposal?: FlashcardProposal) => {...};
  const saveAcceptedFlashcards = async () => {...};
  
  return {
    state,
    setSourceText,
    startGeneration,
    handleProposalAction,
    saveAcceptedFlashcards
  };
}
```

Hook ten będzie odpowiedzialny za:
1. Przechowywanie tekstu źródłowego
2. Walidację tekstu przed generowaniem
3. Wywołanie API generowania fiszek
4. Przechowywanie i zarządzanie propozycjami fiszek
5. Zapisywanie zaakceptowanych fiszek

## 7. Integracja API

Widok będzie korzystał z endpointu `/api/generations` do generowania propozycji fiszek:

### Generowanie fiszek
- **Metoda**: POST
- **Endpoint**: `/api/generations`
- **Typ żądania**: `GenerateFlashcardsCommand`
  ```typescript
  {
    source_text: string; // 1000-10000 znaków
    model?: string; // opcjonalnie
  }
  ```
- **Typ odpowiedzi**: `GenerateFlashcardsResponseDTO`
  ```typescript
  {
    generation_id: string;
    flashcards: FlashcardResponseDTO[];
  }
  ```

### Zapisywanie zaakceptowanych fiszek
- **Metoda**: POST
- **Endpoint**: `/api/flashcards`
- **Typ żądania**: `CreateFlashcardsCommand`
  ```typescript
  {
    flashcards: CreateFlashcardDTO[];
  }
  ```
- **Typ odpowiedzi**: Potwierdzenie utworzenia fiszek

## 8. Interakcje użytkownika

1. **Wprowadzanie tekstu**:
   - Użytkownik wprowadza tekst w polu tekstowym
   - System na bieżąco waliduje długość tekstu i wyświetla licznik znaków
   - Przycisk "Generuj" jest aktywny tylko gdy tekst spełnia wymagania (1000-10000 znaków)

2. **Generowanie fiszek**:
   - Po kliknięciu "Generuj" system wysyła żądanie do API
   - Wyświetlany jest wskaźnik postępu
   - W przypadku błędu wyświetlany jest komunikat o błędzie
   - Po zakończeniu generowania wyświetlana jest lista propozycji

3. **Przeglądanie propozycji**:
   - Użytkownik widzi listę wygenerowanych propozycji fiszek
   - Dla każdej propozycji może:
     - Zaakceptować (zmienia status na 'accepted')
     - Odrzucić (zmienia status na 'rejected')
     - Edytować (otwiera tryb edycji)

4. **Edycja propozycji**:
   - W trybie edycji użytkownik może modyfikować tekst przodu i tyłu fiszki
   - Po zakończeniu edycji propozycja automatycznie otrzymuje status 'accepted'

5. **Zapisywanie fiszek**:
   - Po wybraniu propozycji użytkownik klika "Zapisz zaakceptowane"
   - System zapisuje tylko fiszki o statusie 'accepted'
   - Po zapisie wyświetlane jest potwierdzenie i opcja powrotu do listy fiszek lub generowania nowych

## 9. Warunki i walidacja

1. **Walidacja tekstu źródłowego**:
   - Minimalna długość: 1000 znaków
   - Maksymalna długość: 10000 znaków
   - Walidacja odbywa się w czasie rzeczywistym podczas wprowadzania tekstu
   - Komunikat o błędzie jest wyświetlany pod polem tekstowym

2. **Walidacja zapisu**:
   - Przycisk "Zapisz zaakceptowane" jest aktywny tylko gdy istnieje co najmniej jedna zaakceptowana propozycja

## 10. Obsługa błędów

1. **Błędy walidacji**:
   - Wyświetlanie komunikatów pod odpowiednimi polami
   - Blokowanie akcji, które wymagają poprawnych danych

2. **Błędy API**:
   - Obsługa błędów HTTP (400, 401, 500)
   - Wyświetlanie przyjaznych komunikatów o błędach
   - Możliwość ponowienia akcji w przypadku błędów sieciowych

3. **Obsługa przypadków brzegowych**:
   - Brak wygenerowanych propozycji - wyświetlenie komunikatu i opcji ponownego generowania
   - Utrata połączenia podczas generowania - możliwość wznowienia procesu
   - Zbyt długi czas generowania - wyświetlenie komunikatu o opóźnieniu

## 11. Kroki implementacji

1. **Utworzenie podstawowej struktury widoku**:
   - Stworzenie pliku strony `/src/pages/generate.astro`
   - Implementacja podstawowego layoutu

2. **Implementacja komponentów React**:
   - Utworzenie głównego komponentu `GeneratorView.tsx`
   - Implementacja `TextInputSection.tsx` z walidacją
   - Implementacja `GenerationStatus.tsx`
   - Implementacja `ProposalList.tsx` i `ProposalItem.tsx`

3. **Implementacja hooka zarządzającego stanem**:
   - Utworzenie `useGeneratorState.ts` z logiką biznesową
   - Implementacja funkcji do komunikacji z API

4. **Integracja z API**:
   - Implementacja funkcji wywołujących endpoint `/api/generations`
   - Implementacja funkcji zapisujących zaakceptowane fiszki

5. **Implementacja logiki walidacji**:
   - Walidacja tekstu źródłowego
   - Walidacja przed zapisem fiszek

6. **Implementacja obsługi błędów**:
   - Obsługa błędów API
   - Obsługa przypadków brzegowych

7. **Implementacja modalu dla widoku `/flashcards`**:
   - Dodanie przycisku otwierającego modal w widoku fiszek
   - Implementacja komponentu modalowego z `GeneratorView`

8. **Testy i optymalizacje**:
   - Testowanie różnych scenariuszy użycia
   - Optymalizacja wydajności komponentów
   - Dopracowanie UX dla różnych stanów widoku
