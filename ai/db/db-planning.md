<conversation_summary>
<database schema>
encje i pola:
Tabela "users": id (UUID, primary key), email, hashed_password, created_at, updated_at, itp.
Tabela "flashcards": id (UUID, primary key), user_id (UUID, foreign key odnoszący się do "users"), front_text, back_text, status (boolean, gdzie true oznacza "success", a false "failed"), created_at, updated_at
<database schema>
<decisions>
Relacja między użytkownikami a fiszkami jest typu one-to-many.
Klucze główne w obu tabelach będą korzystać z UUID.
Pole status w tabeli "flashcards" zostanie zaimplementowane jako typ boolean.
Partycjonowanie tabeli jest pomijane na tym etapie.
Bezpieczeństwo zostanie wdrożone przy użyciu RLS z wykorzystaniem mechanizmu Supabase Auth.
Operacje odczytu mają być dominującą operacją na bazie danych.
Skalowanie poza MVP nie jest aktualnie rozważane.
Integralność danych zostanie wymuszona poprzez m.in. foreign key constraints.
</decisions>
<matched_recommendations>
Użycie UUID dla jednoznacznej identyfikacji rekordów.
Indeksowanie kolumny user_id w tabeli "flashcards" w celu przyspieszenia operacji odczytu.
Implementacja polityk RLS zgodnie z mechanizmami Supabase Auth dla zabezpieczenia danych użytkownika.
Użycie boolean do przechowywania statusu ostatniej sesji, co upraszcza logikę w warstwie aplikacji.
</matched_recommendations>
<database_planning_summary>
Projekt bazy danych dla MVP obejmuje dwie główne encje: "users" oraz "flashcards". Użytkownik jest powiązany z wieloma fiszkami za pomocą relacji one-to-many, gdzie każda fiszka posiada odpowiedni klucz obcy "user_id". Klucze główne zostaną oparte na UUID, co zapewni wysoką unikalność i elastyczność. Pole status w tabeli "flashcards" zostanie zdefiniowane jako boolean, przechowujące wynik ostatniej sesji jako "success" lub "failed". Na obecnym etapie pomijamy partycjonowanie i skalowanie, koncentrując się na optymalizacji operacji odczytu. Bezpieczeństwo danych gwarantowane będzie m.in. przez wdrożenie polityk RLS z wykorzystaniem Supabase Auth, co zapewni, że użytkownik będzie miał dostęp jedynie do własnych danych. Integralność danych zostanie zagwarantowana poprzez stosowanie ograniczeń, takich jak foreign key constraints.
</database_planning_summary>
<unresolved_issues>
Brak nierozwiązanych kwestii – wszystkie główne obszary planowania bazy danych zostały określone i zaakceptowane.
</unresolved_issues>
</conversation_summary>