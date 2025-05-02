# Plan implementacji widoku Generator AI

## 1. Przegląd
Generator AI to widok umożliwiający użytkownikom automatyczne generowanie fiszek z wprowadzonego tekstu przy pomocy modeli AI. Jego głównym celem jest znaczące przyspieszenie procesu tworzenia fiszek edukacyjnych poprzez automatyzację generowania pytań i odpowiedzi z tekstu źródłowego.

## 2. Routing widoku
Widok będzie dostępny na dwa sposoby:
- Jako dedykowana strona pod adresem: `/generate`
- Jako modal dostępny z widoku listy fiszek (`/flashcards`)

## 3. Struktura komponentów
```
AIGeneratorContainer
├── SourceTextInput
├── GeneratorControls
├── ProgressIndicator (widoczny podczas generowania)
├── FlashcardProposalList
│   ├── FlashcardProposal (wiele instancji)
│   │   ├── ProposalCard
│   │   └── ProposalActions
└── ErrorDisplay (widoczny w przypadku błędu)
```

## 4. Szczegóły komponentów

### AIGeneratorContainer
- **Opis komponentu**: Główny kontener dla całego widoku generatora, zarządzający układem i stanem generacji
- **Główne elementy**: 
  - Dwukolumnowy układ (na urządzeniach desktop): lewa kolumna z formularzem, prawa z propozycjami
  - Jednosekcyjny układ na urządzeniach mobilnych (sekcje ułożone pionowo)
  - Kontener dla wszystkich podkomponentów z odpowiednim padingiem i układem
- **Obsługiwane interakcje**: 
  - Inicjowanie procesu generacji
  - Anulowanie procesu generacji
  - Zarządzanie stanem przetwarzania
- **Obsługiwana walidacja**: 
  - Sprawdzanie czy tekst źródłowy ma wymaganą długość (1000-10000 znaków)
  - Weryfikacja statusu odpowiedzi API
- **Typy**: 
  - `GeneratorState` (stan generatora)
  - `GenerateFlashcardsCommand`
  - `GenerateFlashcardsResponseDTO`
- **Propsy**: 
  - `isModal?: boolean` - określa czy komponent jest renderowany jako modal czy jako pełna strona
  - `onClose?: () => void` - funkcja wywoływana po zamknięciu, istotna tylko w wersji modalnej

### SourceTextInput
- **Opis komponentu**: Komponent do wprowadzania tekstu źródłowego z licznikiem znaków i walidacją
- **Główne elementy**: 
  - Duże pole tekstowe (`<textarea>`) z możliwością przewijania
  - Licznik znaków z informacją o minimalnej i maksymalnej długości
  - Obszar do upuszczania plików tekstowych (drag & drop)
- **Obsługiwane interakcje**: 
  - Wprowadzanie tekstu
  - Wklejanie tekstu z automatycznym czyszczeniem formatowania
  - Przeciąganie i upuszczanie tekstu (drag & drop)
  - Automatyczne rozszerzanie pola tekstowego w miarę wprowadzania tekstu
- **Obsługiwana walidacja**: 
  - Weryfikacja długości tekstu (1000-10000 znaków)
  - Wyświetlanie komunikatów walidacyjnych
  - Kolorystyczne oznaczenie stanu walidacji (poprawny/niepoprawny)
- **Typy**: 
  - `SourceTextInputProps`
- **Propsy**: 
  - `value: string` - aktualny tekst
  - `onChange: (text: string) => void` - handler zmiany tekstu
  - `isValid: boolean` - czy tekst spełnia warunki
  - `errorMessage?: string` - komunikat błędu walidacji
  - `isDisabled?: boolean` - czy komponent jest wyłączony

### GeneratorControls
- **Opis komponentu**: Panel kontrolny z przyciskami do zarządzania procesem generacji
- **Główne elementy**: 
  - Przycisk "Generuj" (aktywny gdy tekst jest poprawny)
  - Przycisk "Anuluj generowanie" (widoczny podczas generowania)
  - Opcjonalnie: selector modelu AI (jeśli aplikacja obsługuje wiele modeli)
- **Obsługiwane interakcje**: 
  - Inicjowanie generacji
  - Anulowanie trwającej generacji
  - Wybór modelu AI (opcjonalnie)
- **Obsługiwana walidacja**: 
  - Blokowanie przycisku generowania gdy tekst jest niepoprawny
- **Typy**: 
  - `GeneratorControlsProps`
- **Propsy**: 
  - `onGenerate: () => void` - handler inicjujący generację
  - `onCancel?: () => void` - handler anulujący generację
  - `isGenerating: boolean` - czy trwa generowanie
  - `isValid: boolean` - czy tekst jest poprawny
  - `models?: string[]` - dostępne modele (opcjonalnie)
  - `selectedModel?: string` - wybrany model (opcjonalnie)
  - `onModelChange?: (model: string) => void` - handler zmiany modelu

### ProgressIndicator
- **Opis komponentu**: Wizualizacja postępu procesu generowania
- **Główne elementy**: 
  - Pasek postępu z animacją
  - Tekst opisujący aktualny stan generowania
- **Obsługiwane interakcje**: 
  - Brak interakcji użytkownika (komponent informacyjny)
- **Obsługiwana walidacja**: brak
- **Typy**: 
  - `ProgressIndicatorProps`
- **Propsy**: 
  - `isVisible: boolean` - czy wskaźnik jest widoczny
  - `status?: string` - opcjonalny tekst statusu

### FlashcardProposalList
- **Opis komponentu**: Lista wygenerowanych propozycji fiszek z opcjami zarządzania
- **Główne elementy**: 
  - Nagłówek z licznikiem propozycji
  - Przyciski akcji zbiorowych ("Akceptuj wszystko", "Odrzuć wszystko")
  - Lista komponentów FlashcardProposal
  - Komunikat pusty stan, gdy brak propozycji
- **Obsługiwane interakcje**: 
  - Akcje zbiorcze (akceptacja/odrzucenie wszystkich)
  - Przegląd propozycji
  - Zarządzanie stanem propozycji
- **Obsługiwana walidacja**: brak
- **Typy**: 
  - `FlashcardProposalListProps`
  - `ProposalState` - mapa stanów propozycji (zaakceptowana/odrzucona/edytowana)
- **Propsy**: 
  - `proposals: FlashcardResponseDTO[]` - lista propozycji
  - `proposalStates: ProposalState` - stan propozycji
  - `onAcceptAll: () => void` - handler akceptacji wszystkich
  - `onRejectAll: () => void` - handler odrzucenia wszystkich
  - `onProposalStateChange: (id: string, state: 'accepted' | 'rejected' | 'edited') => void` - handler zmiany stanu

### FlashcardProposal
- **Opis komponentu**: Pojedyncza propozycja fiszki z opcjami zarządzania
- **Główne elementy**: 
  - Karta z treścią przodu i tyłu fiszki
  - Przyciski akcji (akceptuj, odrzuć, edytuj)
  - Formularz edycji (widoczny w trybie edycji)
- **Obsługiwane interakcje**: 
  - Akceptacja propozycji
  - Odrzucenie propozycji
  - Edycja propozycji
  - Zapisanie zmian po edycji
- **Obsługiwana walidacja**: 
  - Sprawdzanie czy pola edycji nie są puste
- **Typy**: 
  - `FlashcardProposalProps`
- **Propsy**: 
  - `proposal: FlashcardResponseDTO` - dane propozycji
  - `state: 'pending' | 'accepted' | 'rejected' | 'editing'` - stan propozycji
  - `onAccept: (id: string) => void` - handler akceptacji
  - `onReject: (id: string) => void` - handler odrzucenia
  - `onEdit: (id: string) => void` - handler przejścia do trybu edycji
  - `onSaveEdit: (id: string, frontText: string, backText: string) => void` - handler zapisania edycji

### ErrorDisplay
- **Opis komponentu**: Wyświetlanie błędów związanych z generowaniem
- **Główne elementy**: 
  - Komunikat błędu
  - Przycisk ponowienia próby
- **Obsługiwane interakcje**: 
  - Ponowienie próby generowania
- **Obsługiwana walidacja**: brak
- **Typy**: 
  - `ErrorDisplayProps`
- **Propsy**: 
  - `error: any` - obiekt lub komunikat błędu
  - `onRetry: () => void` - handler ponowienia próby

## 5. Typy

### GeneratorState
```typescript
type GeneratorState = 
  | { status: 'idle' } 
  | { status: 'validating' }
  | { status: 'generating' }
  | { status: 'completed', data: GenerateFlashcardsResponseDTO }
  | { status: 'error', error: any };
```

### ProposalState
```typescript
interface ProposalState {
  [flashcardId: string]: {
    status: 'pending' | 'accepted' | 'rejected' | 'editing';
    editedFrontText?: string;
    editedBackText?: string;
  }
}
```

### SourceTextInputProps
```typescript
interface SourceTextInputProps {
  value: string;
  onChange: (text: string) => void;
  isValid: boolean;
  errorMessage?: string;
  isDisabled?: boolean;
}
```

### ProposalViewModel (rozszerza FlashcardResponseDTO)
```typescript
interface ProposalViewModel extends FlashcardResponseDTO {
  status: 'pending' | 'accepted' | 'rejected' | 'editing';
  isEdited: boolean;
  originalFrontText: string;
  originalBackText: string;
  editedFrontText?: string;
  editedBackText?: string;
}
```

## 6. Zarządzanie stanem

Widok będzie korzystał z customowego hooka `useAIGenerator`, który zarządza całym procesem generowania i stanem propozycji:

```typescript
function useAIGenerator() {
  // Stan tekstu źródłowego i jego walidacja
  const [sourceText, setSourceText] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string | undefined>(undefined);
  
  // Stan procesu generacji
  const [generatorState, setGeneratorState] = useState<GeneratorState>({ status: 'idle' });
  
  // Stan propozycji fiszek
  const [proposalStates, setProposalStates] = useState<ProposalState>({});
  
  // Funkcje pomocnicze
  const isSourceTextValid = useCallback(() => {
    return sourceText.length >= VALIDATION_CONSTANTS.SOURCE_TEXT_MIN_LENGTH && 
           sourceText.length <= VALIDATION_CONSTANTS.SOURCE_TEXT_MAX_LENGTH;
  }, [sourceText]);
  
  // Inicjowanie generacji
  const generateFlashcards = useCallback(async () => {
    if (!isSourceTextValid()) return;
    
    setGeneratorState({ status: 'generating' });
    
    try {
      const response = await fetch('/api/generations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          source_text: sourceText,
          model: selectedModel 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Błąd podczas generowania fiszek');
      }
      
      const data: GenerateFlashcardsResponseDTO = await response.json();
      setGeneratorState({ status: 'completed', data });
      
      // Inicjalizacja stanu propozycji
      const initialProposalStates: ProposalState = {};
      data.flashcards.forEach(flashcard => {
        initialProposalStates[flashcard.id] = { status: 'pending' };
      });
      setProposalStates(initialProposalStates);
      
    } catch (error) {
      setGeneratorState({ status: 'error', error });
    }
  }, [sourceText, selectedModel, isSourceTextValid]);
  
  // Anulowanie generacji (wymaga implementacji po stronie serwera)
  const cancelGeneration = useCallback(() => {
    setGeneratorState({ status: 'idle' });
  }, []);
  
  // Zarządzanie propozycjami
  const acceptProposal = useCallback((id: string) => {
    setProposalStates(prev => ({
      ...prev,
      [id]: { ...prev[id], status: 'accepted' }
    }));
  }, []);
  
  const rejectProposal = useCallback((id: string) => {
    setProposalStates(prev => ({
      ...prev,
      [id]: { ...prev[id], status: 'rejected' }
    }));
  }, []);
  
  const editProposal = useCallback((id: string) => {
    setProposalStates(prev => ({
      ...prev,
      [id]: { ...prev[id], status: 'editing' }
    }));
  }, []);
  
  const saveProposalEdit = useCallback((id: string, frontText: string, backText: string) => {
    setProposalStates(prev => ({
      ...prev,
      [id]: { 
        ...prev[id], 
        status: 'accepted', 
        editedFrontText: frontText, 
        editedBackText: backText 
      }
    }));
  }, []);
  
  const acceptAllProposals = useCallback(() => {
    const newStates = { ...proposalStates };
    Object.keys(newStates).forEach(id => {
      newStates[id] = { ...newStates[id], status: 'accepted' };
    });
    setProposalStates(newStates);
  }, [proposalStates]);
  
  const rejectAllProposals = useCallback(() => {
    const newStates = { ...proposalStates };
    Object.keys(newStates).forEach(id => {
      newStates[id] = { ...newStates[id], status: 'rejected' };
    });
    setProposalStates(newStates);
  }, [proposalStates]);
  
  // Pobieranie propozycji z uwzględnieniem ich stanu
  const getProposalsWithState = useCallback(() => {
    if (generatorState.status !== 'completed') return [];
    
    return generatorState.data.flashcards.map(flashcard => {
      const state = proposalStates[flashcard.id] || { status: 'pending' };
      return {
        ...flashcard,
        status: state.status,
        isEdited: Boolean(state.editedFrontText || state.editedBackText),
        originalFrontText: flashcard.front_text,
        originalBackText: flashcard.back_text,
        editedFrontText: state.editedFrontText,
        editedBackText: state.editedBackText
      } as ProposalViewModel;
    });
  }, [generatorState, proposalStates]);
  
  // Pobranie zaakceptowanych propozycji do zapisania
  const getAcceptedProposals = useCallback(() => {
    return getProposalsWithState()
      .filter(p => p.status === 'accepted')
      .map(p => ({
        front_text: p.editedFrontText || p.front_text,
        back_text: p.editedBackText || p.back_text,
        creation: p.isEdited ? 'ai-edited' : 'ai' as FlashcardCreationType,
        generation_id: generatorState.status === 'completed' ? generatorState.data.generation_id : undefined
      }));
  }, [getProposalsWithState, generatorState]);
  
  return {
    sourceText,
    setSourceText,
    selectedModel,
    setSelectedModel,
    generatorState,
    isSourceTextValid,
    generateFlashcards,
    cancelGeneration,
    proposalStates,
    acceptProposal,
    rejectProposal,
    editProposal,
    saveProposalEdit,
    acceptAllProposals,
    rejectAllProposals,
    getProposalsWithState,
    getAcceptedProposals
  };
}
```

## 7. Integracja API

Widok Generator AI integruje się z endpointem `/api/generations` poprzez metodę POST, zgodnie ze specyfikacją:

### Żądanie
```typescript
// Ciało żądania (zgodne z GenerateFlashcardsCommand)
{
  source_text: string; // Tekst od 1000 do 10000 znaków
  model?: string;      // Opcjonalny identyfikator modelu
}
```

### Odpowiedź
```typescript
// Odpowiedź (zgodna z GenerateFlashcardsResponseDTO)
{
  generation_id: string;
  flashcards: FlashcardResponseDTO[];
}

// gdzie FlashcardResponseDTO to:
{
  id: string;
  front_text: string;
  back_text: string;
  creation: FlashcardCreationType; // 'ai' | 'manual' | 'ai-edited'
  generation_id: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}
```

### Obsługa błędów
- Status 400: Błąd walidacji (np. tekst źródłowy ma niewłaściwą długość)
- Status 500: Błąd serwera (np. problem z modelem AI)

## 8. Interakcje użytkownika

### Wprowadzanie tekstu źródłowego
1. Użytkownik wprowadza tekst bezpośrednio do pola tekstowego
2. Użytkownik może wkleić tekst ze schowka (Ctrl+V / Cmd+V)
3. Użytkownik może przeciągnąć i upuścić plik tekstowy do pola
4. Podczas wprowadzania tekstu licznik znaków aktualizuje się automatycznie
5. Jeśli liczba znaków jest poza dozwolonym zakresem, wyświetlany jest stosowny komunikat błędu
6. Przycisk "Generuj" jest aktywny tylko gdy tekst ma prawidłową długość

### Generowanie fiszek
1. Użytkownik klika przycisk "Generuj"
2. Komponent przechodzi w stan generowania:
   - Pole tekstowe jest zablokowane
   - Pojawia się wskaźnik postępu z animacją
   - Przycisk "Generuj" zmienia się na "Anuluj generowanie"
3. Jeśli generowanie się powiedzie:
   - Wskaźnik postępu znika
   - Lista propozycji fiszek pojawia się w prawej kolumnie (lub poniżej na mobilnych)
4. Jeśli wystąpi błąd:
   - Wyświetlany jest komunikat błędu
   - Użytkownik może ponowić próbę

### Zarządzanie propozycjami
1. Użytkownik może zaakceptować, odrzucić lub edytować każdą propozycję
2. Użytkownik może zaakceptować lub odrzucić wszystkie propozycje naraz
3. W trybie edycji:
   - Pojawia się formularz z polami do edycji pytania i odpowiedzi
   - Użytkownik może anulować edycję lub zapisać zmiany
4. Zaakceptowane propozycje są oznaczone na zielono
5. Odrzucone propozycje są oznaczone na czerwono lub szaro
6. Edytowane propozycje mają oznaczenie "edytowane"

## 9. Warunki i walidacja

### Walidacja tekstu źródłowego
- Minimalna długość: 1000 znaków
- Maksymalna długość: 10000 znaków
- Walidacja jest przeprowadzana:
  - Po każdej zmianie tekstu
  - Przed wysłaniem żądania

### Walidacja pól edycji propozycji
- Pole pytania nie może być puste
- Pole odpowiedzi nie może być puste
- Walidacja jest przeprowadzana przy próbie zapisania edycji

### Warunki generowania
- Tekst musi spełniać warunki długości
- Użytkownik musi być zalogowany (stan autoryzacji jest weryfikowany przez API)

## 10. Obsługa błędów

### Błędy walidacji
- Wyświetlanie komunikatu pod polem tekstowym
- Wyróżnienie pola tekstowego kolorem (czerwona ramka)
- Blokowanie przycisku "Generuj"

### Błędy API
- Podczas generowania:
  - Wyświetlenie komunikatu z opisem błędu
  - Opcja ponowienia próby
  - Możliwość zmiany tekstu źródłowego

### Obsługa anulowania
- Jeśli użytkownik anuluje generowanie:
  - Stan generatora wraca do "idle"
  - Pole tekstowe staje się znów dostępne
  - Usuwa się wskaźnik postępu

### Obsługa problemów z siecią
- Wykrywanie problemu z połączeniem
- Wyświetlenie odpowiedniego komunikatu
- Automatyczne ponowienie próby po przywróceniu połączenia

## 11. Kroki implementacji

1. **Przygotowanie struktury plików**:
   - Utworzenie komponentu strony w `/src/pages/generate.astro`
   - Utworzenie komponentu modalnego w `/src/components/GeneratorModal.tsx`
   - Przygotowanie struktury folderów dla komponentów generatora

2. **Implementacja komponentów bazowych**:
   - Implementacja SourceTextInput z walidacją
   - Implementacja GeneratorControls
   - Implementacja ProgressIndicator
   - Implementacja ErrorDisplay

3. **Implementacja customowego hooka**:
   - Utworzenie `useAIGenerator` zgodnie ze specyfikacją
   - Testy jednostkowe hooka

4. **Implementacja komponentów wyświetlania propozycji**:
   - Implementacja FlashcardProposal
   - Implementacja FlashcardProposalList
   - Implementacja formularza edycji propozycji

5. **Integracja komponentów**:
   - Złożenie wszystkich komponentów w AIGeneratorContainer
   - Implementacja layoutu responsywnego
   - Dodanie obsługi drag & drop i paste detection

6. **Integracja z API**:
   - Połączenie z endpointem `/api/generations`
   - Implementacja obsługi błędów
   - Dodanie obsługi tokenów autoryzacyjnych

7. **Implementacja strony i modalu**:
   - Dodanie AIGeneratorContainer do strony `/generate`
   - Implementacja GeneratorModal wykorzystującego AIGeneratorContainer
   - Dodanie przycisku otwierającego modal w widoku fiszek

8. **Testowanie i debugowanie**:
   - Testy jednostkowe kluczowych komponentów
   - Testy integracyjne całego widoku
   - Testy responsywności na różnych urządzeniach

9. **Optymalizacja wydajności**:
   - Implementacja memoizacji komponentów React
   - Optymalizacja renderowania listy propozycji
   - Redukcja zbędnych renderowań

10. **Finalizacja i dokumentacja**:
    - Przegląd kodu i refaktoryzacja
    - Dodanie komentarzy i dokumentacji
    - Przygotowanie do code review
