# Architektura UI dla 10x-cards

## 1. Przegląd struktury UI

Architektura UI 10x-cards została zaprojektowana z myślą o prostocie i efektywności, skupiając się na dwóch głównych ścieżkach użytkownika:
- Zarządzanie fiszkami (tworzenie manualne, generowanie przez AI, edycja, akceptacja, odrzucanie)
- Prosta nauka (wyświetlanie pytania, odkrywanie odpowiedzi)

Interfejs wykorzystuje system modułowy oparty na komponentach, z naciskiem na responsywność i dostępność. Główne interakcje są realizowane przez modalne interfejsy, co pozwala zachować kontekst i płynność działania.

## 2. Lista widoków

### Strona główna (/)
- **Cel**: Prezentacja wartości produktu i przekierowanie do rejestracji/logowania
- **Kluczowe informacje**: 
  - Opis głównych funkcji
  - Statystyki użycia (liczba wygenerowanych fiszek)
  - Przykłady zastosowania
- **Komponenty**:
  - Hero section z CTA (wezwaniem do działania)
  - Sekcja funkcji w układzie grid (3 kolumny na desktop, 1 na mobile)
- **Szczegóły interakcji**:
  - Przycisk "Rozpocznij za darmo" kieruje do strony rejestracji
  - Przycisk "Zaloguj się" dla istniejących użytkowników
  - Animowane przejścia między sekcjami podczas przewijania
  - Interaktywna demonstracja generowania fiszek przez AI
- **Układ i wygląd**:
  - Pełnoekranowy hero z gradientowym tłem
  - Jednolita kolorystyka z akcentami kolorystycznymi na przyciskach CTA
  - Kontrastowe nagłówki dla lepszej czytelności
  - Ikony ilustrujące główne funkcje

### Autoryzacja (/auth/login, /auth/register)
- **Cel**: Bezpieczna autentykacja użytkownika przy pomocy Supabase Auth
- **Kluczowe informacje**:
  - Formularze logowania/rejestracji
  - Komunikaty błędów
  - Linki do odzyskiwania hasła
- **Komponenty**:
  - AuthForm korzystający z Supabase Auth
  - Walidacja pól w czasie rzeczywistym
  - System powiadomień o błędach/sukcesie
  - Opcjonalny system dwuskładnikowego uwierzytelniania
- **Szczegóły interakcji**:
  - Walidacja e-mail w czasie rzeczywistym (format, dostępność)
  - Wskaźnik siły hasła z rekomendacjami poprawy
  - Automatyczne przeniesienie na dashboard po pomyślnej autoryzacji
  - Mechanizm "zapamiętaj mnie" z cookies sesji
- **Układ i wygląd**:
  - Minimalistyczny design formularzy
  - Wyraźne komunikaty błędów pod odpowiednimi polami
  - Stonowane tło, skupienie na formularzu
  - Ikony wskazujące status pól (poprawne/niepoprawne)

### Dashboard (/dashboard)
- **Cel**: Centrum zarządzania dla użytkownika po zalogowaniu
- **Kluczowe informacje**:
  - Statystyki użytkownika (liczba fiszek, sesje nauki)
  - Ostatnio używane zestawy fiszek
  - Przyciski szybkiego dostępu do głównych funkcji
- **Komponenty**:
  - StatisticCards - karty z kluczowymi metrykami
  - RecentFlashcards - lista ostatnio utworzonych/edytowanych fiszek
  - QuickActionButtons - szybki dostęp do tworzenia i nauki
  - WelcomeMessage - spersonalizowane powitanie
- **Szczegóły interakcji**:
  - One-click access do rozpoczęcia nauki lub tworzenia fiszek
  - Możliwość kontynuacji ostatniej sesji nauki
  - Skróty do najczęściej używanych funkcji
  - Pull-to-refresh na urządzeniach mobilnych
- **Układ i wygląd**:
  - Wyraźne przyciski akcji z ikonami i etykietami
  - Przyjazny, kolorowy design z animacjami przejścia

### Lista fiszek (/flashcards)
- **Cel**: Zarządzanie kolekcją fiszek
- **Kluczowe informacje**:
  - Lista fiszek z możliwością filtrowania
  - Statystyki nauki
  - Przyciski akcji (edycja, usuwanie)
- **Komponenty**:
  - FlashcardList z paginacją i infinite scroll
  - Filtry i wyszukiwarka z autouzupełnianiem
  - Modalne okna edycji/tworzenia
  - ActionBar z opcjami masowymi (usuwanie wielu, eksport)
  - EmptyState dla pustej listy fiszek
- **Szczegóły interakcji**:
  - Multi-select z checkboxami do operacji masowych
  - Filtrowanie po źródle (AI vs. ręczne) i dacie utworzenia
- **Układ i wygląd**:
  - Responsywna tabela/lista z kolumnami
  - Karty fiszek z podglądem treści (pytanie i fragment odpowiedzi)
  - Kolorowe oznaczenia źródła fiszek (AI: niebieski, manualne: zielony)
  - Sticky header z opcjami filtrowania i wyszukiwania
  - Compact i expanded view (przełączane)

### Generator AI (/generate lub modal w /flashcards)
- **Cel**: Generowanie fiszek z tekstu
- **Kluczowe informacje**:
  - Pole wprowadzania tekstu
  - Status generowania
  - Lista propozycji
- **Komponenty**:
  - TextInput z licznikiem znaków i validacją (1000-10000 znaków)
  - AIGenerator z opcjami konfiguracji
  - ProgressIndicator z animacją (podczas generowania)
  - ProposalList z opcjami akceptacji/odrzucenia/edycji
  - ErrorHandler dla błędów API
- **Szczegóły interakcji**:
  - Paste detection i automatyczne czyszczenie formatowania
  - Przyciski "Akceptuj wszystko" i "Odrzuć wszystko"
  - Możliwość edycji pojedynczych propozycji w miejscu
  - Drag & drop dla tekstu (np. z dokumentu)
  - Wskaźnik postępu generowania
  - Opcja anulowania trwającego generowania
- **Układ i wygląd**:
  - Dwukolumnowy układ (tekst źródłowy | propozycje)
  - Karty propozycji z wyraźnymi przyciskami akcji
  - Animowany wskaźnik postępu generowania
  - Kolorystyczne rozróżnienie zaakceptowanych/odrzuconych propozycji
  - Responsywny design (jednosekcyjny na mobile)

### Edycja fiszki (modal w /flashcards)
- **Cel**: Tworzenie i modyfikacja pojedynczej fiszki
- **Kluczowe informacje**:
  - Pola edycji przodu i tyłu fiszki
  - Opcje formatowania
  - Przyciski zapisz/anuluj
- **Komponenty**:
  - FlashcardForm z polami i walidacją
  - RichTextEditor z podstawowym formatowaniem
  - PreviewTab do podglądu wyglądu na karcie
  - SubmitButtons z zapisaniem/anulowaniem
- **Szczegóły interakcji**:
  - Real-time preview podczas edycji
  - Autosave w formie draftu
  - Wskaźnik liczby znaków z limitem
  - Walidacja zawartości przed zapisaniem
- **Układ i wygląd**:
  - Dwa główne pola tekstowe (przód/tył)
  - Przyciski formatowania w postaci toolbara
  - Podgląd fiszki w wersji finalnej
  - Responsywny layout (stackowany na mobile)

### Sesja nauki (/study)
- **Cel**: Prosta nauka z wykorzystaniem wyświetlania pytania i odkrywania odpowiedzi
- **Kluczowe informacje**:
  - Aktualna fiszka (pytanie)
  - Przycisk do odkrywania odpowiedzi
  - Prosty mechanizm przechodzenia do kolejnej fiszki
- **Komponenty**:
  - StudyCard z mechanizmem odkrywania odpowiedzi (flip animation)
  - Przyciski nawigacji (następna, poprzednia)
  - ProgressBar pokazujący pozycję w zestawie
  - SessionSummary na zakończenie sesji
  - KeyboardShortcuts dla szybszej nawigacji
- **Szczegóły interakcji**:
  - Kliknięcie/tapnięcie karty odwraca ją, pokazując odpowiedź
  - Swipe w lewo/prawo do nawigacji między fiszkami
  - Skróty klawiszowe (spacja: pokaż odpowiedź, strzałki: nawigacja)
  - Przyciski "Znam" / "Nie znam" (opcjonalnie, do przyszłego rozwoju)
  - Możliwość wstrzymania i kontynuacji sesji
  - Podsumowanie na końcu sesji
- **Układ i wygląd**:
  - Pełnoekranowa karta na środku
  - Animowana transformacja 3D przy odkrywaniu odpowiedzi
  - Minimalistyczny interfejs z ukrytymi kontrolkami (pojawiają się po interakcji)
  - Pasek postępu na górze ekranu
  - Przyjazna kolorystyka (neutralne tło, akcentowane przyciski)

### Profil użytkownika (/profile)
- **Cel**: Zarządzanie kontem i preferencjami
- **Kluczowe informacje**:
  - Dane konta
  - Preferencje nauki
  - Historia aktywności
- **Komponenty**:
  - AccountSettings z opcjami konta
  - StudyPreferences do personalizacji nauki
  - ActivityLog z historią generowań i sesji
  - DeleteAccount do bezpiecznego usuwania konta
- **Szczegóły interakcji**:
  - Edycja danych profilu z walidacją
  - Zmiana hasła z weryfikacją
  - Zarządzanie preferencjami powiadomień
  - Eksport wszystkich danych (zgodność z RODO)
  - Proces usuwania konta z potwierdzeniem
- **Układ i wygląd**:
  - Widok tabulowany z sekcjami
  - Formularze z jasnym oznaczeniem pól wymaganych
  - Przyciski akcji z odpowiednimi kolorami (usuwanie: czerwony)
  - Responsywny layout z zachowaniem czytelności na małych ekranach

## 3. Mapa podróży użytkownika

### Główna ścieżka generowania fiszek:
1. Logowanie do systemu (Supabase Auth)
2. Przejście do listy fiszek (Przycisk "Moje fiszki" w nawigacji)
3. Otwarcie generatora AI (Przycisk "Generuj z AI" na liście fiszek)
4. Wprowadzenie tekstu (Pole tekstowe z walidacją 1000-10000 znaków)
5. Uruchomienie generowania (Przycisk "Generuj fiszki")
6. Przegląd i edycja propozycji (Lista z opcjami Akceptuj/Edytuj/Odrzuć)
7. Zatwierdzenie wybranych fiszek (Przycisk "Zapisz wybrane")
8. Powrót do listy fiszek z nowymi elementami

**Alternatywne ścieżki:**
- Błąd generowania: System wyświetla komunikat błędu, użytkownik może spróbować ponownie
- Brak akceptowalnych propozycji: Użytkownik może wrócić i zmodyfikować tekst wejściowy
- Timeout sesji: System zapisuje draft, umożliwiając kontynuację po ponownym zalogowaniu

### Ścieżka manualnego tworzenia fiszek:
1. Logowanie do systemu
2. Przejście do listy fiszek
3. Wybranie "Dodaj nową fiszkę"
4. Wypełnienie formularza (przód i tył)
5. Zapisanie fiszki
6. Powrót do listy fiszek

### Ścieżka nauki:
1. Wybór "Rozpocznij naukę" z listy fiszek
2. Prezentacja pierwszej fiszki (pytanie)
3. Odkrycie odpowiedzi przez użytkownika (kliknięcie/tapnięcie)
4. Przejście do kolejnej fiszki (przycisk "Następna" lub swipe)
5. Zakończenie sesji po przeglądnięciu wszystkich fiszek
6. Wyświetlenie podsumowania sesji

**Alternatywne ścieżki:**
- Przerwanie sesji: Użytkownik może zatrzymać sesję i wrócić później
- Nawigacja wstecz: Możliwość powrotu do poprzednich fiszek
- Reset sesji: Opcja rozpoczęcia od nowa

## 4. Układ i struktura nawigacji

### Nawigacja główna:
- Logo (powrót do dashboard)
- Moje fiszki (lista wszystkich fiszek)
- Rozpocznij naukę (bezpośrednie przejście do sesji)
- Generuj z AI (szybki dostęp do generatora)
- Profil użytkownika (ustawienia konta)
- Wyloguj

### Nawigacja kontekstowa:
- Breadcrumbs w widoku listy i generatora
- Przyciski powrotu w modałach i widokach zagnieżdżonych
- Skróty do często używanych akcji w headerze każdego widoku
- Nawigacja stopkowa na mobile (bottom bar)

### Modalne interfejsy:
- Generator AI (pełnoekranowy modal)
- Edycja fiszki (modal z ciemnym overlay)
- Tworzenie fiszki (modal z ciemnym overlay)
- Potwierdzenia akcji (małe, centralne modalne okna)
- Powiadomienia o błędach (toasty)

### Responsywne zachowanie:
- Desktop: Pełna nawigacja w headerze, sidebar dla zaawansowanych opcji
- Tablet: Zwinięta nawigacja w headerze, rozwijane menu
- Mobile: Nawigacja w bottom bar, hamburger menu dla pozostałych opcji

## 5. Kluczowe komponenty

### FlashcardList
- **Funkcjonalności**:
  - Zarządzanie listą fiszek z paginacją
  - Filtrowanie i sortowanie fiszek
  - Masowe operacje (zaznaczanie, usuwanie)
  - Szybki podgląd zawartości fiszek
- **Warianty**:
  - Kompaktowy (tylko pytania)
  - Rozszerzony (pytania i fragment odpowiedzi)
  - Kafelkowy (widok kartowy na mobile)

### AIGenerator
- **Funkcjonalności**:
  - Interfejs wprowadzania tekstu źródłowego
  - Walidacja tekstu wejściowego (1000-10000 znaków)
  - Zarządzanie procesem generowania (start, anulowanie)
  - Prezentacja propozycji z opcjami akceptacji/odrzucenia/edycji
- **Stany**:
  - Początkowy (formularz wprowadzania)
  - Generowanie (wskaźnik postępu)
  - Wyniki (lista propozycji)
  - Błąd (komunikat z opcją ponowienia)

### StudySession
- **Funkcjonalności**:
  - Wyświetlanie fiszek z mechanizmem odkrywania odpowiedzi
  - Nawigacja między fiszkami
  - Śledzenie postępu sesji
  - Podsumowanie po zakończeniu
- **Interakcje**:
  - Kliknięcie/tapnięcie do odkrycia odpowiedzi
  - Swipe/przyciski do zmiany fiszki
  - Skróty klawiszowe dla szybszej nawigacji
  - Opcja przerwania i wznowienia sesji

### AuthForm
- **Funkcjonalności**:
  - Integracja z Supabase Auth
  - Obsługa rejestracji i logowania
  - Walidacja danych wejściowych
  - Obsługa błędów autoryzacji
- **Warianty**:
  - Rejestracja (pełny formularz)
  - Logowanie (uproszczony)
  - Resetowanie hasła

### Toast
- **Funkcjonalności**:
  - Wyświetlanie powiadomień systemowych
  - Różne typy komunikatów (sukces, błąd, info)
  - Automatyczne zamykanie po czasie
  - Możliwość ręcznego zamknięcia
- **Warianty**:
  - Success (zielony)
  - Error (czerwony)
  - Warning (żółty)
  - Info (niebieski)

### ErrorBoundary
- **Funkcjonalności**:
  - Przechwytywanie błędów aplikacji
  - Wyświetlanie przyjaznych komunikatów
  - Opcje recovery (restart, powrót)
  - Logowanie błędów do systemu
- **Poziomy obsługi**:
  - Komponent (izolowany błąd)
  - Widok (fallback dla całego widoku)
  - Aplikacja (globalny handler)

## 6. Biblioteki i zasoby

### Shadcn/ui
- Zestaw podstawowych komponentów UI
- Customizacja pod specyficzne potrzeby aplikacji
- Tematyzacja z wykorzystaniem CSS variables

### Tailwind CSS
- Utility-first CSS framework
- Responsywność i spójność wizualna
- Łatwa customizacja pod różne breakpointy

### Framer Motion
- Biblioteka animacji dla React
- Płynne przejścia między stanami UI
- Animacje karty w sesji nauki

### Supabase Auth
- Kompletny system autentykacji
- Integracja z UI logowania/rejestracji
- Zarządzanie sesją użytkownika

### Lucide Icons
- Spójny zestaw ikon
- Dostępny w różnych rozmiarach
- Wspiera animacje i interaktywność

## 7. Wytyczne dotyczące dostępności

### Klawiatura i nawigacja
- Wszystkie interakcje dostępne z poziomu klawiatury
- Logiczny porządek tabulacji
- Wyraźny focus state dla wszystkich interaktywnych elementów

### Kontrast i czytelność
- Minimalny kontrast 4.5:1 dla tekstu
- Skalowalna typografia (rem/em zamiast px)
- Możliwość powiększenia UI bez utraty funkcjonalności

### Komunikaty i labelki
- Wszystkie pola formularzy z odpowiednimi labelkami
- Komunikaty błędów bezpośrednio przy polach
- Aria-live dla dynamicznych komunikatów

### Obsługa czytników ekranowych
- Semantyczny HTML
- Aria-roles dla komponentów niestandardowych
- Alt-teksty dla wszystkich obrazów i ikon

## 8. Wytyczne stylowania

### Kolorystyka
- **Podstawowa**: Neutralne odcienie (biały, szary)
- **Akcenty**: Niebieski (#3B82F6), Zielony (#10B981), Czerwony (#EF4444)
- **Pomocnicze**: Żółty (#F59E0B), Fioletowy (#8B5CF6)
- **Dark mode**: Automatyczne dostosowanie kolorystyki

### Typografia
- **Nagłówki**: Inter, Sans-serif, waga 600-700
- **Tekst**: Inter, Sans-serif, waga 400-500
- **Hierarchia**: Nagłówki 24-36px, Podtytuły 18-20px, Tekst 14-16px
- **Responsywność**: Skalowanie na różnych urządzeniach

### Ikonografia
- **System**: Lucide Icons
- **Rozmiary**: 16px, 20px, 24px
- **Interaktywne**: Z hover state i transitions
- **Spójność**: Jednolity styl w całej aplikacji

### Spacing i układ
- **Grid**: 4px base (4, 8, 16, 24, 32, 48, 64)
- **Padding**: 16px dla małych komponentów, 24-32px dla sekcji
- **Marginy**: 8-16px między elementami powiązanymi, 32-48px między sekcjami
- **Breakpointy**: Mobile (<640px), Tablet (640-1024px), Desktop (>1024px) 