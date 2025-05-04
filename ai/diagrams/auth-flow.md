# Diagram przepływu autentykacji w 10x-cards

## Komponenty i przepływ autentykacji

```mermaid
flowchart TD
    %% Definicja styli
    classDef page fill:#f9f,stroke:#333,stroke-width:2px
    classDef component fill:#bbf,stroke:#333,stroke-width:2px
    classDef service fill:#bfb,stroke:#333,stroke-width:2px
    classDef storage fill:#fbb,stroke:#333,stroke-width:2px

    %% Strony Astro
    LoginPage["/auth/login.astro"]:::page
    RegisterPage["/auth/register.astro"]:::page
    ResetPage["/auth/reset-password.astro"]:::page
    NewPasswordPage["/auth/new-password.astro"]:::page
    Layout["Layout.astro"]:::page

    %% Komponenty React
    LoginForm["LoginForm.tsx"]:::component
    RegisterForm["RegisterForm.tsx"]:::component
    ResetForm["ResetPasswordForm.tsx"]:::component
    NewPasswordForm["NewPasswordForm.tsx"]:::component
    UserMenu["UserMenu.tsx"]:::component
    Navbar["Navbar.tsx"]:::component

    %% Serwisy i przechowywanie
    SupabaseAuth["Supabase Auth"]:::service
    SupabaseClient["supabaseClient"]:::service
    Middleware["Middleware (context.locals.supabase)"]:::service
    LocalStorage["Local Storage (sesja)"]:::storage

    %% Przepływ logowania
    LoginPage --> LoginForm
    LoginForm --> SupabaseClient
    SupabaseClient --> SupabaseAuth
    SupabaseAuth --> LocalStorage
    LocalStorage --> Navbar
    Navbar --> UserMenu

    %% Przepływ rejestracji
    RegisterPage --> RegisterForm
    RegisterForm --> SupabaseClient

    %% Przepływ resetowania hasła
    ResetPage --> ResetForm
    ResetForm --> SupabaseClient
    NewPasswordPage --> NewPasswordForm
    NewPasswordForm --> SupabaseClient

    %% Middleware i Layout
    Layout --> Middleware
    Middleware --> SupabaseClient

    %% Subgrafy dla grupowania logicznego
    subgraph "Strony Astro"
        LoginPage
        RegisterPage
        ResetPage
        NewPasswordPage
        Layout
    end

    subgraph "Komponenty React"
        LoginForm
        RegisterForm
        ResetForm
        NewPasswordForm
        UserMenu
        Navbar
    end

    subgraph "Backend i Przechowywanie"
        SupabaseAuth
        SupabaseClient
        Middleware
        LocalStorage
    end
```

## Opis przepływu

1. Użytkownik wchodzi na jedną z czterech stron autentykacji:
   - `/auth/login.astro` - logowanie
   - `/auth/register.astro` - rejestracja
   - `/auth/reset-password.astro` - resetowanie hasła
   - `/auth/new-password.astro` - ustawianie nowego hasła

2. Każda strona zawiera odpowiedni komponent React do obsługi formularza:
   - `LoginForm.tsx` - formularz logowania
   - `RegisterForm.tsx` - formularz rejestracji
   - `ResetPasswordForm.tsx` - formularz resetowania hasła
   - `NewPasswordForm.tsx` - formularz nowego hasła

3. Komponenty formularzy komunikują się z Supabase Auth poprzez `supabaseClient`:
   - Walidacja danych formularza (React Hook Form + Zod)
   - Wysyłanie żądań do Supabase Auth
   - Obsługa odpowiedzi i błędów

4. Po udanej autentykacji:
   - Supabase Auth zapisuje token sesji w Local Storage
   - Użytkownik jest przekierowywany do strony głównej
   - `Navbar.tsx` wyświetla `UserMenu.tsx` z opcjami użytkownika

5. Middleware (`context.locals.supabase`):
   - Zapewnia dostęp do `supabaseClient` we wszystkich komponentach
   - Automatycznie dołącza token sesji do żądań API

6. Layout (`Layout.astro`):
   - Zawiera główny układ aplikacji
   - Wyświetla `Navbar` z odpowiednim stanem autentykacji
   - Zarządza przekierowaniami dla chronionych tras
