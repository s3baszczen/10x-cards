# Plan Testów Aplikacji "10xDevs Astro Starter" (Flashcards Generator)

## 1. Wprowadzenie i Cele Testowania

### 1.1 Wprowadzenie

Niniejszy dokument opisuje strategię, zakres, zasoby i harmonogram testów dla aplikacji "10xDevs Astro Starter", której główną funkcjonalnością jest generowanie fiszek edukacyjnych na podstawie tekstu źródłowego przy użyciu AI oraz ich przeglądanie. Projekt wykorzystuje nowoczesny stack technologiczny, w tym Astro, React, TypeScript, Supabase i Tailwind CSS.

### 1.2 Cele Testowania

Główne cele procesu testowania to:

*   Zapewnienie, że aplikacja spełnia zdefiniowane wymagania funkcjonalne i niefunkcjonalne.
*   Wykrycie i zaraportowanie defektów oprogramowania na jak najwcześniejszym etapie rozwoju.
*   Weryfikacja stabilności, wydajności i użyteczności kluczowych funkcji aplikacji (generowanie AI, przeglądanie fiszek).
*   Sprawdzenie poprawności integracji pomiędzy komponentami frontendowymi, API i bazą danych Supabase.
*   Zapewnienie spójności wizualnej i poprawnego działania interfejsu użytkownika na różnych urządzeniach i przeglądarkach (w zakresie zdefiniowanym w zakresie).
*   Weryfikacja poprawnej obsługi błędów i mechanizmów logowania.
*   Zbudowanie zaufania do jakości dostarczanego oprogramowania.

## 2. Zakres Testów

### 2.1 Funkcjonalności objęte testami

*   **Generowanie Fiszek AI:**
    *   Wprowadzanie tekstu źródłowego (wpisywanie, wklejanie, drag & drop pliku).
    *   Walidacja długości tekstu źródłowego (minimalna i maksymalna).
    *   Wybór modelu AI (jeśli dotyczy).
    *   Inicjowanie procesu generowania.
    *   Wyświetlanie wskaźnika postępu generowania.
    *   Anulowanie procesu generowania.
    *   Wyświetlanie listy wygenerowanych propozycji fiszek.
    *   Akceptacja/odrzucenie pojedynczej propozycji.
    *   Edycja pojedynczej propozycji (zmiana tekstu przodu/tyłu, walidacja pól edycji).
    *   Zapis edytowanej propozycji.
    *   Anulowanie edycji propozycji.
    *   Akceptacja/odrzucenie wszystkich propozycji.
    *   Zapis zaakceptowanych fiszek (wywołanie odpowiedniej funkcji/API).
    *   Obsługa błędów generowania (wyświetlanie komunikatu, opcja ponowienia).
    *   Działanie generatora w trybie strony (`/generate`) i potencjalnie w modalu (wymaga weryfikacji spójności implementacji `GeneratorModal.tsx` vs `AIGeneratorContainer.tsx`).
*   **Przeglądanie Fiszek:**
    *   Wyświetlanie listy istniejących fiszek.
    *   Wyświetlanie zawartości przodu fiszki.
    *   Odwracanie fiszki w celu wyświetlenia tyłu (interakcja kliknięciem).
    *   Rozróżnienie fiszek utworzonych ręcznie vs. AI.
    *   Wyświetlanie stanu pustego (brak fiszek).
    *   Wyświetlanie stanu ładowania (symulowanego/rzeczywistego).
    *   Działanie przycisku "Generuj z AI" (otwieranie modala/przekierowanie).
    *   Działanie przycisku "Dodaj fiszkę" (jeśli zaimplementowany).
*   **Interfejs Użytkownika (UI):**
    *   Nawigacja między stronami (`/`, `/generate`, `/flashcards`).
    *   Poprawność wyświetlania komponentów UI (przyciski, karty, modale, alerty, etc.).
    *   Responsywność interfejsu na różnych rozmiarach ekranu (desktop, tablet, mobile - podstawowy zakres).
    *   Spójność wizualna (motyw jasny/ciemny - podstawowy zakres).
*   **API (`/api/generations`):**
    *   Obsługa żądań POST z poprawnymi danymi.
    *   Walidacja danych wejściowych (brakujące pola, niepoprawna długość tekstu).
    *   Poprawność odpowiedzi w przypadku sukcesu (status 200, format JSON).
    *   Poprawność odpowiedzi w przypadku błędów walidacji (status 400).
    *   Poprawność odpowiedzi w przypadku błędów serwera (status 500, 503 itp.).
    *   Integracja z `GenerationsService`.
*   **Integracja z Bazą Danych (Supabase):**
    *   Poprawność zapisu danych generacji (`generations`).
    *   Poprawność zapisu danych fiszek (`flashcards`) powiązanych z generacją.
    *   Poprawność zapisu logów błędów (`generation_error_logs`).
    *   *(Uwaga: Obecnie serwisy używają mocków, testy pełnej integracji będą możliwe po usunięciu mockowania).*
*   **Logowanie Błędów:**
    *   Weryfikacja, czy błędy występujące w serwisach są logowane (obecnie do konsoli, docelowo do Supabase).

### 2.2 Funkcjonalności wyłączone z testów (lub o niższym priorytecie)

*   Zaawansowane testy wydajnościowe (poza podstawową obserwacją czasu odpowiedzi).
*   Pełne testy kompatybilności na wszystkich możliwych przeglądarkach i systemach operacyjnych (skupienie na najpopularniejszych: Chrome, Firefox, Edge - najnowsze wersje).
*   Testy bezpieczeństwa wykraczające poza podstawową walidację wejścia (np. testy penetracyjne).
*   Testowanie logiki autentykacji i autoryzacji użytkowników (brak widocznych implementacji w kodzie, ale `user_id` w DB sugeruje plany).
*   Testowanie funkcjonalności dodawania/edycji fiszek ręcznie (brak widocznej implementacji UI poza przyciskiem).
*   Testy dokładności i jakości merytorycznej treści generowanych przez AI (poza sprawdzeniem, czy treść jest generowana).
*   Testy mechanizmów statycznej analizy kodu (ESLint, Prettier) - zakładamy, że działają poprawnie.

## 3. Typy Testów do Przeprowadzenia

*   **Testy Jednostkowe (Unit Tests):**
    *   **Cel:** Weryfikacja poprawności działania izolowanych fragmentów kodu (funkcje, komponenty React, serwisy, schematy Zod).
    *   **Narzędzia:** Vitest (lub Jest), React Testing Library, Supabase-js mocki.
    *   **Zakres:** Komponenty React (`src/components/`), serwisy (`src/lib/services/` - z mockowaniem zależności), funkcje pomocnicze (`src/lib/utils/`), schematy walidacji Zod.
*   **Testy Integracyjne (Integration Tests):**
    *   **Cel:** Weryfikacja współpracy między różnymi modułami systemu.
    *   **Zakres:**
        *   **Integracja Komponentów React:** Testowanie przepływu danych i interakcji między powiązanymi komponentami (np. `AIGeneratorContainer` z `SourceTextInput`, `FlashcardProposalList`).
        *   **Integracja API:** Testowanie endpointu `/api/generations` w kontekście Astro, weryfikacja interakcji z serwisami i (docelowo) bazą danych.
        *   **Integracja Serwisów z Bazą Danych:** Testowanie serwisów (`GenerationsService`) z rzeczywistą (testową) instancją Supabase.
    *   **Narzędzia:** Vitest/Jest, React Testing Library, Supertest (dla API Astro), testowa baza danych Supabase (np. lokalny Docker).
*   **Testy End-to-End (E2E Tests):**
    *   **Cel:** Symulacja rzeczywistych scenariuszy użytkownika w przeglądarce, weryfikacja przepływów pracy od początku do końca.
    *   **Narzędzia:** Playwright (preferowany ze względu na szybkość i możliwości) lub Cypress.
    *   **Zakres:** Kluczowe przepływy użytkownika:
        *   Generowanie fiszek AI (od wpisania tekstu do zobaczenia propozycji i zapisu).
        *   Przeglądanie fiszek (ładowanie strony, odwracanie fiszek).
        *   Podstawowa nawigacja.
        *   Obsługa błędów widoczna dla użytkownika.
*   **Testy Wizualne (Visual Regression Tests) - Opcjonalnie/Niższy Priorytet:**
    *   **Cel:** Wykrywanie niezamierzonych zmian w wyglądzie interfejsu użytkownika.
    *   **Narzędzia:** Storybook + Chromatic, Playwright/Cypress z porównywaniem zrzutów ekranu.
    *   **Zakres:** Kluczowe komponenty UI (`src/components/ui/`, `FlashcardItem`, `FlashcardProposal`).
*   **Testy Manualne (Manual Testing):**
    *   **Cel:** Eksploracyjne testowanie aplikacji, weryfikacja użyteczności, wyszukiwanie nieoczywistych błędów, ocena UX.
    *   **Zakres:** Cała aplikacja, ze szczególnym uwzględnieniem nowych funkcji i obszarów ryzyka. Niezbędne przed każdym wydaniem.

## 4. Scenariusze Testowe dla Kluczowych Funkcjonalności

*(Przykładowe scenariusze, pełna lista będzie rozwijana w systemie zarządzania testami)*

**4.1 Generowanie Fiszek AI (`/generate` lub Modal)**

| ID Scenariusza | Opis                                                                                                | Oczekiwany Rezultat                                                                                                                                      | Typ Testu | Priorytet |
| :------------- | :-------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------- | :-------- |
| GEN-001        | Wprowadź tekst spełniający minimalne wymagania długości i kliknij "Generuj fiszki".                 | Rozpoczyna się proces generowania, widoczny wskaźnik postępu, po zakończeniu wyświetlana jest lista propozycji fiszek.                                  | E2E, Int  | Wysoki    |
| GEN-002        | Wprowadź tekst poniżej minimalnej długości.                                                        | Przycisk "Generuj fiszki" jest nieaktywny LUB wyświetlany jest komunikat błędu walidacji przy próbie generowania.                                          | E2E, Unit | Wysoki    |
| GEN-003        | Wprowadź tekst powyżej maksymalnej długości.                                                       | Wyświetlany jest komunikat o przekroczeniu limitu znaków; Przycisk "Generuj fiszki" jest nieaktywny LUB walidacja API zwraca błąd 400.                    | E2E, Int  | Wysoki    |
| GEN-004        | Rozpocznij generowanie i kliknij "Anuluj generowanie" podczas trwania procesu.                      | Proces generowania zostaje przerwany, UI wraca do stanu początkowego (idle).                                                                             | E2E       | Średni    |
| GEN-005        | Wygeneruj fiszki, zaakceptuj kilka propozycji, odrzuć inne.                                        | Stan propozycji (obramowanie, status) poprawnie się aktualizuje. Liczniki zaakceptowanych/odrzuconych są poprawne.                                      | E2E, Unit | Wysoki    |
| GEN-006        | Wygeneruj fiszki, kliknij "Edytuj" na propozycji, zmień tekst i kliknij "Zapisz zmiany".              | Propozycja przechodzi w tryb edycji, pola są edytowalne. Po zapisie tekst propozycji jest zaktualizowany, stan wraca do 'pending' lub 'accepted'.        | E2E, Unit | Wysoki    |
| GEN-007        | Wygeneruj fiszki, kliknij "Edytuj", wprowadź pusty tekst w pole "Przód" i spróbuj zapisać.           | Wyświetlany jest komunikat błędu walidacji ("Pytanie nie może być puste"), zmiany nie są zapisywane.                                                   | Unit, E2E | Wysoki    |
| GEN-008        | Wygeneruj fiszki, kliknij "Akceptuj wszystkie".                                                    | Wszystkie propozycje zmieniają stan na 'accepted'.                                                                                                       | E2E, Unit | Średni    |
| GEN-009        | Wygeneruj fiszki, kliknij "Odrzuć wszystkie".                                                      | Wszystkie propozycje zmieniają stan na 'rejected'.                                                                                                       | E2E, Unit | Średni    |
| GEN-010        | Wygeneruj fiszki, zaakceptuj kilka i kliknij "Zapisz zaakceptowane" (jeśli jest taki przycisk).      | Wywoływana jest odpowiednia funkcja/API z zaakceptowanymi fiszkami. Modal (jeśli dotyczy) zamyka się, stan generatora jest resetowany.                 | E2E, Int  | Wysoki    |
| GEN-011        | Symuluj błąd API podczas generowania (np. status 500 z `/api/generations`).                         | Wyświetlany jest komponent `ErrorDisplay` z odpowiednim komunikatem błędu. Przycisk "Spróbuj ponownie" jest dostępny.                                  | E2E, Int  | Wysoki    |
| GEN-012        | Przeciągnij poprawny plik tekstowy (.txt) na pole `SourceTextInput`.                               | Zawartość pliku tekstowego zostaje wczytana do pola tekstowego, usuwane są nadmiarowe białe znaki.                                                      | E2E, Unit | Średni    |
| GEN-013        | Wklej tekst do `SourceTextInput`.                                                                   | Tekst zostaje wklejony, usuwane są nadmiarowe białe znaki.                                                                                              | E2E, Unit | Średni    |
| GEN-014        | Zmień model AI w selektorze przed generowaniem.                                                     | Wybrany model jest przekazywany do API (`/api/generations`).                                                                                            | E2E, Int  | Średni    |

**4.2 Przeglądanie Fiszek (`/flashcards`)**

| ID Scenariusza | Opis                                                                               | Oczekiwany Rezultat                                                                                                     | Typ Testu | Priorytet |
| :------------- | :--------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------- | :-------- | :-------- |
| FL-001         | Otwórz stronę `/flashcards` gdy istnieją fiszki.                                    | Lista fiszek jest wyświetlana poprawnie (widoczny przód). Stan ładowania jest widoczny przed pojawieniem się fiszek. | E2E, Int  | Wysoki    |
| FL-002         | Kliknij na fiszkę.                                                                 | Fiszka odwraca się, pokazując tekst odpowiedzi (tył).                                                                  | E2E, Unit | Wysoki    |
| FL-003         | Kliknij ponownie na odwróconą fiszkę.                                              | Fiszka odwraca się z powrotem, pokazując tekst pytania (przód).                                                         | E2E, Unit | Wysoki    |
| FL-004         | Otwórz stronę `/flashcards` gdy nie ma żadnych fiszek.                              | Wyświetlany jest komunikat "Nie masz jeszcze żadnych fiszek" oraz przyciski akcji.                                     | E2E, Int  | Średni    |
| FL-005         | Sprawdź wygląd fiszki wygenerowanej przez AI vs. utworzonej ręcznie (jeśli są obie). | Fiszki AI mają odpowiednią adnotację ("Wygenerowano przez AI").                                                        | E2E       | Średni    |
| FL-006         | Kliknij przycisk "Generuj z AI".                                                   | Otwiera się modal do generowania fiszek LUB następuje przekierowanie na `/generate`.                                    | E2E       | Wysoki    |

**4.3 API Endpoint (`/api/generations`)**

| ID Scenariusza | Opis                                                                       | Oczekiwany Rezultat                                                                          | Typ Testu | Priorytet |
| :------------- | :------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------- | :-------- | :-------- |
| API-001        | Wyślij żądanie POST z poprawnym `source_text` (w zakresie długości).       | Odpowiedź status 200, zawiera `generation_id` i tablicę `flashcards` (mock/rzeczywiste).   | Int       | Wysoki    |
| API-002        | Wyślij żądanie POST bez pola `source_text`.                               | Odpowiedź status 400, zawiera komunikat o błędzie walidacji.                               | Int       | Wysoki    |
| API-003        | Wyślij żądanie POST z `source_text` za krótkim.                           | Odpowiedź status 400, zawiera komunikat o błędzie walidacji (minimalna długość).            | Int       | Wysoki    |
| API-004        | Wyślij żądanie POST z `source_text` za długim.                            | Odpowiedź status 400, zawiera komunikat o błędzie walidacji (maksymalna długość).           | Int       | Wysoki    |
| API-005        | Symuluj błąd wewnętrzny w `GenerationsService` (np. błąd zapisu do DB).   | Odpowiedź status 500, zawiera ogólny komunikat błędu lub szczegóły błędu serwisu.           | Int       | Wysoki    |
| API-006        | Wyślij żądanie POST z opcjonalnym polem `model`.                            | Model zostaje przekazany do `GenerationsService`. Odpowiedź status 200.                   | Int       | Średni    |

## 5. Środowisko Testowe

*   **Środowisko Developerskie (Lokalne):**
    *   Używane do uruchamiania testów jednostkowych i integracyjnych podczas rozwoju.
    *   Wymaga Node.js, pnpm.
    *   Może wymagać lokalnej instancji Supabase (Docker) do testów integracyjnych z DB.
*   **Środowisko Testowe (Staging):**
    *   Oddzielna instancja aplikacji wdrożona na platformie hostingowej (np. Vercel, Netlify, własny serwer).
    *   Połączona z dedykowanym, testowym projektem Supabase (z danymi testowymi, potencjalnie resetowanym okresowo).
    *   Połączona z testowym (lub ograniczonym) kontem API AI (jeśli dotyczy).
    *   Używane do uruchamiania testów E2E i testów manualnych przed wydaniem.
*   **Przeglądarki:**
    *   Testy E2E: Głównie Chrome (lub inny silnik wspierany przez Playwright/Cypress).
    *   Testy Manualne/Kompatybilności: Google Chrome (latest), Mozilla Firefox (latest), Microsoft Edge (latest).
*   **Urządzenia:**
    *   Testy E2E: Emulacja różnych rozmiarów viewportu (desktop, tablet, mobile).
    *   Testy Manualne: Rzeczywiste urządzenia (desktop, popularny model smartfona) jeśli dostępne, lub emulacja w narzędziach deweloperskich przeglądarki.

## 6. Narzędzia do Testowania

*   **Framework do Testów Jednostkowych/Integracyjnych:** Vitest (zgodny z Vite używanym przez Astro) lub Jest.
*   **Biblioteka do Testowania Komponentów React:** React Testing Library (`@testing-library/react`).
*   **Framework do Testów E2E:** Playwright.
*   **Mockowanie API/Zależności:** `msw` (Mock Service Worker), `vi.mock` (Vitest), `jest.mock`.
*   **Testowanie API:** Supertest (dla testów integracyjnych API Astro), klient HTTP (np. `fetch` w testach E2E).
*   **System Zarządzania Testami (TMS):** (Opcjonalnie, w zależności od skali projektu) np. TestRail, Zephyr Scale, Xray, lub prostsze rozwiązania jak arkusze kalkulacyjne/pliki Markdown w repozytorium.
*   **Narzędzie do Śledzenia Błędów (Bug Tracking):** Jira, GitHub Issues, Trello itp. (zintegrowane z procesem deweloperskim).
*   **CI/CD:** GitHub Actions, GitLab CI/CD do automatycznego uruchamiania testów (jednostkowych, integracyjnych, E2E) przy każdym pushu/pull requeście.

## 7. Harmonogram Testów

*   **Testy Jednostkowe i Integracyjne:** Pisane równolegle z kodem developerskim przez programistów i/lub inżynierów QA. Uruchamiane automatycznie w CI/CD.
*   **Testy E2E:** Rozwijane iteracyjnie dla kluczowych przepływów. Uruchamiane automatycznie w CI/CD na środowisku Staging (np. co noc lub przed wdrożeniem).
*   **Testy Manualne (Eksploracyjne):** Przeprowadzane przed każdym planowanym wydaniem na środowisku Staging (np. 1-2 dni przed planowanym wdrożeniem na produkcję).
*   **Testy Regresji:** Uruchamianie pełnego zestawu testów automatycznych (Unit, Int, E2E) oraz wybranych scenariuszy manualnych przed każdym wydaniem, aby upewnić się, że nowe zmiany nie zepsuły istniejących funkcjonalności.

*Szczegółowy harmonogram będzie zależał od planu wydań projektu.*

## 8. Kryteria Akceptacji Testów

### 8.1 Kryteria Wejścia (Rozpoczęcia Testów)

*   Kod źródłowy dla testowanej funkcjonalności jest dostępny w repozytorium (np. w gałęzi feature lub develop).
*   Środowisko testowe (lokalne/staging) jest skonfigurowane i dostępne.
*   Wymagania dla testowanej funkcjonalności są zdefiniowane i zrozumiałe.
*   Testy jednostkowe dla nowych komponentów/serwisów przechodzą pomyślnie (jeśli dotyczy).

### 8.2 Kryteria Wyjścia (Zakończenia Testów / Gotowości do Wydania)

*   Wszystkie zaplanowane testy (automatyczne i manualne) dla danego wydania zostały wykonane.
*   Określony procent testów automatycznych zakończył się sukcesem (np. 100% testów jednostkowych i integracyjnych, 95% testów E2E dla krytycznych ścieżek).
*   Brak otwartych błędów o priorytecie krytycznym (Blocker) lub wysokim (High) związanych z funkcjonalnościami wchodzącymi w skład wydania.
*   Wszystkie błędy o średnim i niskim priorytecie zostały przeanalizowane, a decyzje o ich naprawie (lub odłożeniu) zostały podjęte i udokumentowane.
*   Dokumentacja testowa (raporty z testów, status błędów) jest aktualna.
*   Zespół (Product Owner, Deweloperzy, QA) zgadza się, że aplikacja osiągnęła akceptowalny poziom jakości.

## 9. Role i Odpowiedzialności w Procesie Testowania

*   **Inżynier QA / Tester:**
    *   Projektowanie i utrzymanie planu testów.
    *   Tworzenie i utrzymanie scenariuszy testowych (manualnych i automatycznych E2E).
    *   Wykonywanie testów manualnych (eksploracyjnych, regresyjnych).
    *   Raportowanie i śledzenie błędów.
    *   Konfiguracja i utrzymanie narzędzi do testowania automatycznego E2E.
    *   Analiza wyników testów automatycznych.
    *   Współpraca z programistami w celu zrozumienia funkcjonalności i diagnozowania błędów.
    *   Udział w definiowaniu kryteriów akceptacji.
*   **Programista:**
    *   Pisanie testów jednostkowych i integracyjnych dla tworzonego kodu.
    *   Naprawianie błędów zgłoszonych przez QA lub wykrytych przez testy automatyczne.
    *   Uczestnictwo w przeglądach kodu pod kątem testowalności.
    *   Utrzymanie środowiska deweloperskiego i pomoc w konfiguracji środowisk testowych.
*   **Product Owner / Project Manager:**
    *   Definiowanie wymagań i kryteriów akceptacji.
    *   Priorytetyzacja funkcjonalności i błędów.
    *   Podejmowanie decyzji o wydaniu na podstawie wyników testów i oceny ryzyka.
*   **DevOps / Inżynier Infrastruktury (jeśli dotyczy):**
    *   Konfiguracja i utrzymanie środowisk (Staging, Produkcja).
    *   Konfiguracja i utrzymanie potoków CI/CD do automatyzacji testów.

## 10. Procedury Raportowania Błędów

1.  **Wykrycie Błędu:** Błąd może zostać wykryty podczas testów manualnych, automatycznych lub przez użytkowników (jeśli dotyczy).
2.  **Rejestracja Błędu:**
    *   Każdy wykryty błąd powinien zostać zarejestrowany w systemie śledzenia błędów (np. GitHub Issues, Jira).
    *   Zgłoszenie błędu powinno zawierać:
        *   **Tytuł:** Krótki, zwięzły opis problemu.
        *   **Opis:** Szczegółowy opis błędu, w tym kroki do jego reprodukcji.
        *   **Oczekiwany Rezultat:** Co powinno się wydarzyć.
        *   **Rzeczywisty Rezultat:** Co się wydarzyło.
        *   **Środowisko:** Wersja aplikacji, przeglądarka, system operacyjny, środowisko (Staging/Dev).
        *   **Priorytet/Waga:** Ocena wpływu błędu (np. Blocker, High, Medium, Low).
        *   **Zrzuty Ekranu/Nagrania Wideo:** Jeśli pomagają w zrozumieniu problemu.
        *   **Logi:** Logi z konsoli przeglądarki lub serwera, jeśli są istotne.
        *   **Informacje Dodatkowe:** Wszelkie inne istotne informacje.
3.  **Weryfikacja i Priorytetyzacja:** Zgłoszony błąd jest weryfikowany (czy jest powtarzalny) i priorytetyzowany przez Product Ownera/Project Managera we współpracy z QA i deweloperami.
4.  **Przypisanie i Naprawa:** Błąd jest przypisywany do programisty w celu naprawy.
5.  **Retest:** Po naprawieniu błędu i wdrożeniu poprawki na środowisko testowe, QA wykonuje retest, aby potwierdzić, że błąd został usunięty i nie wprowadzono nowych problemów (testy regresji w powiązanym obszarze).
6.  **Zamknięcie Błędu:** Jeśli retest zakończy się pomyślnie, błąd zostaje zamknięty w systemie śledzenia. Jeśli nie, błąd jest ponownie otwierany i wraca do kroku 4.
7.  **Statusy Błędów:** Błędy będą miały jasno zdefiniowane statusy (np. New, Open, In Progress, Ready for Retest, Closed, Rejected, Deferred).
