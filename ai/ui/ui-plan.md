# Architektura UI dla 10x-cards

## 1. Przegląd struktury UI

Architektura UI 10x-cards została zaprojektowana z myślą o prostocie i efektywności, skupiając się na dwóch głównych ścieżkach użytkownika:
- Zarządzanie fiszkami (tworzenie, edycja, generowanie AI)
- Nauka 

Interfejs wykorzystuje system modułowy oparty na komponentach, z naciskiem na responsywność i dostępność. Główne interakcje są realizowane przez modalne interfejsy, co pozwala zachować kontekst i płynność działania.

## 2. Lista widoków

### Strona główna (/)
- **Cel**: Prezentacja wartości produktu i przekierowanie do rejestracji/logowania
- **Kluczowe informacje**: 
  - Opis głównych funkcji
  - Statystyki użycia (liczba wygenerowanych fiszek)
  - Przykłady zastosowania
- **Komponenty**:
  - Hero section z CTA
  - Sekcja funkcji
  - Sekcja przykładów

### Autoryzacja (/auth/login, /auth/register)
- **Cel**: Bezpieczna autentykacja użytkownika
- **Kluczowe informacje**:
  - Formularze logowania/rejestracji
  - Komunikaty błędów
  - Linki do odzyskiwania hasła
- **Komponenty**:
  - AuthForm (współdzielony)
  - Walidacja pól
  - System powiadomień
- **Względy UX/Dostępność**:
  - Jasne komunikaty błędów
  - Walidacja w czasie rzeczywistym
  - Zabezpieczenia przed atakami

### Lista fiszek (/flashcards)
- **Cel**: Zarządzanie kolekcją fiszek
- **Kluczowe informacje**:
  - Lista fiszek z możliwością filtrowania
  - Statystyki nauki
  - Przyciski akcji (edycja, usuwanie)
- **Komponenty**:
  - FlashcardList z paginacją
  - Filtry i wyszukiwarka
  - Modalne okna edycji/tworzenia
  - Generator AI
- **Względy UX/Dostępność**:
  - Infinite scroll
  - Skróty klawiszowe
  - Potwierdzenia usuwania

### Generator AI (modal w /flashcards)
- **Cel**: Generowanie fiszek z tekstu
- **Kluczowe informacje**:
  - Pole wprowadzania tekstu
  - Status generowania
  - Lista propozycji
- **Komponenty**:
  - AIGenerator
  - ProgressIndicator
  - ProposalList
- **Względy UX/Dostępność**:
  - Wskaźnik postępu
  - Możliwość anulowania
  - Zachowanie stanu przy błędach

### Sesja nauki (/study)
- **Cel**: Efektywna nauka z wykorzystaniem spaced repetition
- **Kluczowe informacje**:
  - Aktualna fiszka
  - Postęp sesji
  - Przyciski oceny
- **Komponenty**:
  - StudyCard z animacją
  - ProgressBar
  - RatingButtons
- **Względy UX/Dostępność**:
  - Obsługa gestów
  - Skróty klawiszowe
  - Możliwość przerwania

## 3. Mapa podróży użytkownika

### Główna ścieżka generowania fiszek:
1. Logowanie do systemu
2. Przejście do listy fiszek
3. Otwarcie generatora AI
4. Wprowadzenie tekstu
5. Przegląd i edycja propozycji
6. Zatwierdzenie wybranych fiszek
7. Powrót do listy

### Ścieżka nauki:
1. Wybór "Rozpocznij naukę" z listy fiszek
2. Prezentacja pierwszej fiszki
3. Interakcja (pokazanie odpowiedzi)
4. Przejście do kolejnej fiszki
5. Zakończenie sesji i podsumowanie

## 4. Układ i struktura nawigacji

### Nawigacja główna:
- Logo (powrót do strony głównej)
- Lista fiszek
- Rozpocznij naukę
- Profil użytkownika
- Wyloguj

### Nawigacja kontekstowa:
- Breadcrumbs w widoku listy
- Przyciski powrotu w modałach
- Skróty do często używanych akcji

### Modalne interfejsy:
- Generator AI
- Edycja fiszki
- Tworzenie fiszki
- Potwierdzenia akcji

## 5. Kluczowe komponenty

### FlashcardList
- Zarządzanie listą fiszek
- Paginacja i filtrowanie
- Akcje na fiszkach
- Integracja z generatorem AI

### AIGenerator
- Interfejs generowania fiszek
- Walidacja tekstu wejściowego
- Zarządzanie statusem generowania
- Lista propozycji do zatwierdzenia

### StudySession
- Interfejs sesji nauki
- Animacje przejść
- System oceny znajomości
- Zarządzanie postępem

### Toast
- System powiadomień
- Różne typy komunikatów
- Automatyczne zamykanie
- Możliwość interakcji

### ErrorBoundary
- Obsługa błędów aplikacji
- Przyjazne komunikaty
- Możliwość recovery
- Logowanie błędów 