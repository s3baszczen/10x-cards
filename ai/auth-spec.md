# Specyfikacja techniczna modułu autentykacji dla 10x-cards

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### 1.1. Nowe strony Astro

#### 1.1.1. Strona logowania (`/src/pages/auth/login.astro`)
- Statyczna strona zawierająca formularz logowania
- Integracja z komponentem React `LoginForm`
- Przekierowanie do strony głównej po pomyślnym logowaniu
- Obsługa błędów logowania i wyświetlanie komunikatów
- Link do strony rejestracji i odzyskiwania hasła

#### 1.1.2. Strona rejestracji (`/src/pages/auth/register.astro`)
- Statyczna strona zawierająca formularz rejestracji
- Integracja z komponentem React `RegisterForm`
- Przekierowanie do strony głównej po pomyślnej rejestracji
- Obsługa błędów rejestracji i wyświetlanie komunikatów
- Link do strony logowania

#### 1.1.3. Strona odzyskiwania hasła (`/src/pages/auth/reset-password.astro`)
- Statyczna strona zawierająca formularz do wprowadzenia adresu e-mail
- Integracja z komponentem React `ResetPasswordForm`
- Komunikat potwierdzający wysłanie linku resetującego hasło
- Link do strony logowania

#### 1.1.4. Strona ustawienia nowego hasła (`/src/pages/auth/new-password.astro`)
- Statyczna strona zawierająca formularz do ustawienia nowego hasła
- Integracja z komponentem React `NewPasswordForm`
- Obsługa parametrów z URL (token resetowania hasła)
- Przekierowanie do strony logowania po pomyślnym zresetowaniu hasła
- Obsługa błędów i wyświetlanie komunikatów

### 1.2. Komponenty React

#### 1.2.1. Komponent `LoginForm` (`/src/components/auth/LoginForm.tsx`)
- Formularz logowania z polami:
  - Adres e-mail (z walidacją formatu)
  - Hasło
  - Przycisk "Zaloguj się"
- Obsługa stanu formularza (React Hook Form + Zod)
- Komunikacja z Supabase Auth API
- Obsługa błędów i wyświetlanie komunikatów
- Obsługa stanu ładowania podczas procesu logowania

#### 1.2.2. Komponent `RegisterForm` (`/src/components/auth/RegisterForm.tsx`)
- Formularz rejestracji z polami:
  - Adres e-mail (z walidacją formatu)
  - Hasło (z walidacją siły hasła)
  - Potwierdzenie hasła
  - Przycisk "Zarejestruj się"
- Obsługa stanu formularza (React Hook Form + Zod)
- Komunikacja z Supabase Auth API
- Obsługa błędów i wyświetlanie komunikatów
- Obsługa stanu ładowania podczas procesu rejestracji

#### 1.2.3. Komponent `ResetPasswordForm` (`/src/components/auth/ResetPasswordForm.tsx`)
- Formularz z polem na adres e-mail
- Obsługa stanu formularza (React Hook Form + Zod)
- Komunikacja z Supabase Auth API (wysyłanie linku resetującego hasło)
- Obsługa błędów i wyświetlanie komunikatów
- Obsługa stanu ładowania podczas procesu wysyłania linku

#### 1.2.4. Komponent `NewPasswordForm` (`/src/components/auth/NewPasswordForm.tsx`)
- Formularz z polami:
  - Nowe hasło (z walidacją siły hasła)
  - Potwierdzenie nowego hasła
  - Przycisk "Ustaw nowe hasło"
- Obsługa stanu formularza (React Hook Form + Zod)
- Komunikacja z Supabase Auth API (ustawianie nowego hasła)
- Obsługa błędów i wyświetlanie komunikatów
- Obsługa stanu ładowania podczas procesu zmiany hasła

#### 1.2.5. Komponent `AuthHeader` (`/src/components/auth/AuthHeader.tsx`)
- Nagłówek dla stron autentykacji
- Logo aplikacji
- Tytuł strony (dynamiczny w zależności od kontekstu)

#### 1.2.6. Komponent `UserMenu` (`/src/components/nav/UserMenu.tsx`)
- Dropdown menu użytkownika w prawym górnym rogu
- Wyświetlanie adresu e-mail zalogowanego użytkownika
- Przycisk wylogowania
- Integracja z komponentami Shadcn/ui (DropdownMenu)

### 1.3. Modyfikacje istniejących komponentów

#### 1.3.1. Layout główny (`/src/layouts/Layout.astro`)
- Dodanie komponentu `Navbar` zawierającego:
  - Logo aplikacji
  - Linki nawigacyjne
  - Komponent `UserMenu` dla zalogowanych użytkowników lub przyciski "Zaloguj się" / "Zarejestruj się" dla niezalogowanych

#### 1.3.2. Komponent `Navbar` (`/src/components/nav/Navbar.tsx`)
- Pasek nawigacyjny aplikacji
- Wyświetlanie odpowiednich elementów w zależności od stanu autentykacji
- Integracja z Shadcn/ui

### 1.4. Walidacja i komunikaty błędów

#### 1.4.1. Walidacja formularzy
- Wykorzystanie Zod do walidacji danych wejściowych
- Walidacja adresu e-mail (format)
- Walidacja hasła (minimalna długość, wymagane znaki specjalne, cyfry, duże litery)
- Walidacja zgodności haseł przy rejestracji i resetowaniu hasła

#### 1.4.2. Komunikaty błędów
- Błędy walidacji formularzy (np. niepoprawny format e-mail, za krótkie hasło)
- Błędy autentykacji (np. niepoprawne dane logowania, konto nie istnieje)
- Błędy serwera (np. problem z połączeniem z Supabase)
- Wykorzystanie komponentów Toast z Shadcn/ui do wyświetlania komunikatów

### 1.5. Scenariusze użytkownika

#### 1.5.1. Rejestracja nowego użytkownika
1. Użytkownik wchodzi na stronę rejestracji
2. Wypełnia formularz rejestracyjny
3. Po pomyślnej walidacji, dane są wysyłane do Supabase Auth
4. W przypadku sukcesu, użytkownik jest automatycznie logowany i przekierowywany do strony głównej
5. W przypadku błędu, wyświetlany jest odpowiedni komunikat

#### 1.5.2. Logowanie użytkownika
1. Użytkownik wchodzi na stronę logowania
2. Wypełnia formularz logowania
3. Po pomyślnej walidacji, dane są wysyłane do Supabase Auth
4. W przypadku sukcesu, użytkownik jest przekierowywany do strony głównej
5. W przypadku błędu, wyświetlany jest odpowiedni komunikat

#### 1.5.3. Odzyskiwanie hasła
1. Użytkownik wchodzi na stronę odzyskiwania hasła
2. Wprowadza adres e-mail
3. Po pomyślnej walidacji, żądanie jest wysyłane do Supabase Auth
4. Użytkownik otrzymuje e-mail z linkiem do resetowania hasła
5. Po kliknięciu w link, użytkownik jest przekierowywany do strony ustawienia nowego hasła
6. Po wprowadzeniu i zatwierdzeniu nowego hasła, użytkownik może się zalogować

#### 1.5.4. Wylogowanie
1. Zalogowany użytkownik klika przycisk wylogowania w menu użytkownika
2. Sesja jest usuwana z Supabase Auth
3. Użytkownik jest przekierowywany do strony głównej jako niezalogowany

## 2. LOGIKA BACKENDOWA

### 2.1. Endpointy API

#### 2.1.1. Endpoint rejestracji (`/src/pages/api/auth/register.ts`)
- Metoda: POST
- Parametry wejściowe:
  - email: string
  - password: string
- Walidacja danych wejściowych za pomocą Zod
- Komunikacja z Supabase Auth API
- Obsługa błędów i zwracanie odpowiednich statusów HTTP

#### 2.1.2. Endpoint logowania (`/src/pages/api/auth/login.ts`)
- Metoda: POST
- Parametry wejściowe:
  - email: string
  - password: string
- Walidacja danych wejściowych za pomocą Zod
- Komunikacja z Supabase Auth API
- Obsługa błędów i zwracanie odpowiednich statusów HTTP

#### 2.1.3. Endpoint wylogowania (`/src/pages/api/auth/logout.ts`)
- Metoda: POST
- Komunikacja z Supabase Auth API
- Usuwanie sesji użytkownika
- Obsługa błędów i zwracanie odpowiednich statusów HTTP

#### 2.1.4. Endpoint resetowania hasła (`/src/pages/api/auth/reset-password.ts`)
- Metoda: POST
- Parametry wejściowe:
  - email: string
- Walidacja danych wejściowych za pomocą Zod
- Komunikacja z Supabase Auth API (wysyłanie e-maila z linkiem resetującym)
- Obsługa błędów i zwracanie odpowiednich statusów HTTP

#### 2.1.5. Endpoint ustawiania nowego hasła (`/src/pages/api/auth/new-password.ts`)
- Metoda: POST
- Parametry wejściowe:
  - password: string
  - token: string (z URL)
- Walidacja danych wejściowych za pomocą Zod
- Komunikacja z Supabase Auth API
- Obsługa błędów i zwracanie odpowiednich statusów HTTP

### 2.2. Modele danych

#### 2.2.1. Schematy walidacji Zod
- `RegisterSchema` - schemat walidacji danych rejestracji
- `LoginSchema` - schemat walidacji danych logowania
- `ResetPasswordSchema` - schemat walidacji danych resetowania hasła
- `NewPasswordSchema` - schemat walidacji danych ustawiania nowego hasła

#### 2.2.2. Typy TypeScript
- `UserSession` - typ reprezentujący sesję użytkownika
- `AuthError` - typ reprezentujący błędy autentykacji

### 2.3. Obsługa wyjątków

#### 2.3.1. Klasy błędów
- `AuthenticationError` - błąd autentykacji (np. niepoprawne dane logowania)
- `ValidationError` - błąd walidacji danych wejściowych
- `ServerError` - błąd serwera (np. problem z połączeniem z Supabase)

#### 2.3.2. Middleware obsługi błędów
- Przechwytywanie i formatowanie błędów
- Zwracanie odpowiednich statusów HTTP i komunikatów

### 2.4. Aktualizacja sposobu renderowania istniejących stron

#### 2.4.1. Middleware autentykacji (`/src/middleware/index.ts`)
- Rozszerzenie istniejącego middleware o funkcjonalność weryfikacji sesji użytkownika
- Dodanie informacji o zalogowanym użytkowniku do `context.locals`
- Przekierowanie niezalogowanych użytkowników do strony logowania dla chronionych ścieżek

#### 2.4.2. Chronione ścieżki
- `/generate.astro` - strona generowania fiszek
- `/flashcards.astro` - strona zarządzania fiszkami
- Wszystkie endpointy API związane z fiszkami

## 3. SYSTEM AUTENTYKACJI

### 3.1. Integracja z Supabase Auth

#### 3.1.1. Klient Supabase Auth (`/src/lib/services/auth.service.ts`)
- Metody do komunikacji z Supabase Auth API:
  - `registerUser(email, password)` - rejestracja nowego użytkownika
  - `loginUser(email, password)` - logowanie użytkownika
  - `logoutUser()` - wylogowanie użytkownika
  - `resetPassword(email)` - wysłanie linku resetującego hasło
  - `updatePassword(password, token)` - ustawienie nowego hasła
  - `getCurrentUser()` - pobranie informacji o aktualnie zalogowanym użytkowniku
  - `getSession()` - pobranie aktualnej sesji użytkownika

#### 3.1.2. Hook React do obsługi autentykacji (`/src/components/hooks/useAuth.ts`)
- Hook dostarczający metody do obsługi autentykacji w komponentach React:
  - `login(email, password)` - logowanie użytkownika
  - `register(email, password)` - rejestracja nowego użytkownika
  - `logout()` - wylogowanie użytkownika
  - `resetPassword(email)` - wysłanie linku resetującego hasło
  - `updatePassword(password)` - ustawienie nowego hasła
  - `user` - informacje o aktualnie zalogowanym użytkowniku
  - `isLoading` - stan ładowania
  - `error` - błąd autentykacji

#### 3.1.3. Kontekst autentykacji (`/src/components/providers/AuthProvider.tsx`)
- Provider React dostarczający kontekst autentykacji dla całej aplikacji
- Przechowywanie stanu autentykacji
- Automatyczne odświeżanie sesji

### 3.2. Bezpieczeństwo

#### 3.2.1. Zabezpieczenie endpointów API
- Weryfikacja sesji użytkownika dla chronionych endpointów
- Walidacja danych wejściowych
- Sanityzacja danych wyjściowych

#### 3.2.2. Zabezpieczenie stron
- Weryfikacja sesji użytkownika dla chronionych stron
- Przekierowanie niezalogowanych użytkowników do strony logowania

#### 3.2.3. Obsługa CSRF
- Generowanie i weryfikacja tokenów CSRF dla formularzy
- Zabezpieczenie przed atakami CSRF

#### 3.2.4. Obsługa XSS
- Sanityzacja danych wejściowych i wyjściowych
- Wykorzystanie Content Security Policy (CSP)

### 3.3. Integracja z istniejącą aplikacją

#### 3.3.1. Aktualizacja istniejących endpointów API
- Dodanie weryfikacji sesji użytkownika
- Dodanie identyfikatora użytkownika do zapytań do bazy danych

#### 3.3.2. Aktualizacja istniejących stron
- Dodanie weryfikacji sesji użytkownika
- Wyświetlanie odpowiednich elementów w zależności od stanu autentykacji

## 4. WNIOSKI I REKOMENDACJE

1. **Architektura interfejsu użytkownika**:
   - Wykorzystanie Astro do renderowania statycznych stron autentykacji
   - Wykorzystanie React do obsługi interaktywnych formularzy
   - Wykorzystanie Shadcn/ui do stylowania komponentów
   - Jasne rozdzielenie odpowiedzialności między komponenty

2. **Logika backendowa**:
   - Wykorzystanie Astro API endpoints do obsługi żądań autentykacji
   - Walidacja danych wejściowych za pomocą Zod
   - Obsługa błędów i zwracanie odpowiednich statusów HTTP
   - Aktualizacja middleware do weryfikacji sesji użytkownika

3. **System autentykacji**:
   - Wykorzystanie Supabase Auth do obsługi rejestracji, logowania i odzyskiwania hasła
   - Implementacja własnych serwisów i hooków do komunikacji z Supabase Auth
   - Zabezpieczenie endpointów API i stron przed nieautoryzowanym dostępem
   - Obsługa błędów autentykacji i wyświetlanie odpowiednich komunikatów

4. **Bezpieczeństwo**:
   - Walidacja danych wejściowych
   - Sanityzacja danych wyjściowych
   - Zabezpieczenie przed atakami CSRF i XSS
   - Bezpieczne przechowywanie sesji użytkownika

5. **Integracja z istniejącą aplikacją**:
   - Aktualizacja istniejących endpointów API o weryfikację sesji użytkownika
   - Aktualizacja istniejących stron o wyświetlanie odpowiednich elementów w zależności od stanu autentykacji
   - Zachowanie istniejącej funkcjonalności aplikacji

6. **Rekomendacje**:
   - Implementacja systemu autentykacji zgodnie z przedstawioną architekturą
   - Dodanie testów jednostkowych i integracyjnych dla nowych komponentów i endpointów
   - Monitorowanie błędów autentykacji i analiza logów
   - Regularne aktualizacje zależności związanych z bezpieczeństwem
