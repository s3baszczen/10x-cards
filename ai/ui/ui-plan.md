# Architektura UI dla 10x-cards

## 1. Struktura aplikacji

Aplikacja 10x-cards skupia się na dwóch głównych funkcjonalnościach:
- Zarządzanie fiszkami (tworzenie, generowanie przez AI, edycja)
- Nauka z fiszek (przeglądanie pytań i odpowiedzi)

## 2. Widoki i komponenty

### Strona główna (/)
- **Cel**: Prezentacja wartości produktu i przekierowanie do rejestracji/logowania
- **Komponenty**:
  - Hero section z przyciskami CTA
  - Sekcja funkcji w układzie grid (3 kolumny)
  - Przykładowa demonstracja działania

### Autoryzacja (/auth/login, /auth/register)
- **Cel**: Autentykacja użytkownika przez Supabase Auth
- **Komponenty**:
  - AuthForm z walidacją
  - System powiadomień o błędach/sukcesie

### Dashboard (/dashboard)
- **Cel**: Centrum zarządzania po zalogowaniu
- **Komponenty**:
  - Statystyki użytkownika
  - Przyciski szybkiego dostępu

### Lista fiszek (/flashcards)
- **Cel**: Zarządzanie kolekcją fiszek
- **Komponenty**:
  - FlashcardList z paginacją
  - Filtry i wyszukiwarka
  - Karty fiszek z podglądem treści (pytanie i fragment odpowiedzi)
  - Przyciski akcji (edycja, usuwanie)

### Generator AI (/generate lub modal w /flashcards)
- **Cel**: Generowanie fiszek z tekstu
- **Kluczowe informacje**:
  - Pole wprowadzania tekstu
  - Status generowania
  - Lista propozycji
- **Komponenty**:
  - TextInput z licznikiem znaków i validacją (1000-10000 znaków)
  - TextInput z walidacją
  - ProgressIndicator podczas generowania
  - ProposalList z opcjami akceptacji/odrzucenia/edycji

### Edycja fiszki (modal w /flashcards)
- **Cel**: Tworzenie i modyfikacja fiszki
- **Kluczowe informacje**:
  - Pola edycji przodu i tyłu fiszki
  - Opcje formatowania
  - Przyciski zapisz/anuluj
- **Komponenty**:
  - FlashcardForm z polami pytania i odpowiedzi
  - Podstawowy edytor tekstu
  - Przyciski zapisz/anuluj

### Sesja nauki (/study)
- **Cel**: Nauka z fiszek
- **Komponenty**:
  - StudyCard z mechanizmem odkrywania odpowiedzi
  - Przyciski nawigacji
  - ProgressBar pokazujący postęp

### Profil użytkownika (/profile)
- **Cel**: Zarządzanie kontem
- **Komponenty**:
  - AccountSettings
  - StudyPreferences
  - DeleteAccount

## 3. Przepływ użytkownika

### Generowanie fiszek:
1. Logowanie → Lista fiszek → Generator AI
2. Wprowadzenie tekstu → Generowanie → Przegląd propozycji
3. Akceptacja/edycja wybranych → Zapisanie

### Manualne tworzenie:
1. Lista fiszek → Dodaj fiszkę → Wypełnienie formularza → Zapisanie

### Nauka:
1. Wybór "Rozpocznij naukę" → Przeglądanie fiszek (pytanie → odpowiedź)
2. Nawigacja między fiszkami → Zakończenie sesji → Podsumowanie

## 4. Nawigacja

- **Główna**: Logo, Moje fiszki, Rozpocznij naukę, Generuj z AI, Profil, Wyloguj
- **Responsywność**: 
  - Desktop: Pełna nawigacja w headerze

## 5. Kluczowe komponenty

### FlashcardList
- Lista fiszek z paginacją i filtrowaniem
- Warianty: kompaktowy i rozszerzony

### AIGenerator
- Wprowadzanie tekstu i generowanie fiszek
- Zarządzanie propozycjami AI

### StudySession
- Wyświetlanie fiszek z odkrywaniem odpowiedzi
- Nawigacja i śledzenie postępu

### AuthForm
- Integracja z Supabase Auth
- Obsługa rejestracji i logowania

### Kolorystyka
- **Podstawowa**: Neutralne odcienie
- **Akcenty**: Niebieski (#3B82F6), Zielony (#10B981), Czerwony (#EF4444)
- **Dark mode**: Automatyczne dostosowanie

### Typografia
- **Font**: Inter, Sans-serif
- **Hierarchia**: Nagłówki (24-36px), Tekst (14-16px)

### Spacing
- **Grid**: 4px base (4, 8, 16, 24, 32, 48, 64)
- **Breakpointy**: Mobile (<640px), Tablet (640-1024px), Desktop (>1024px)