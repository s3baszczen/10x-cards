# Database Schema for 10x-cards

## 1. Tables

### Users
This table will be created and managed by supabase
- **id**: UUID, primary key, default generated value (e.g. uuid_generate_v4()).
- **email**: VARCHAR(255), NOT NULL, UNIQUE.  -- Email length limited to 255 characters.
- **hashed_password**: VARCHAR(255), NOT NULL.  -- Hashed password length limited to 255 characters.
- **created_at**: TIMESTAMPTZ, NOT NULL, default CURRENT_TIMESTAMP.
- **updated_at**: TIMESTAMPTZ, NOT NULL, default CURRENT_TIMESTAMP.

### Flashcards
- **id**: UUID, primary key, default generated value (e.g. uuid_generate_v4()).
- **user_id**: UUID, NOT NULL, foreign key referencing auth.users(id).
- **front_text**: TEXT, NOT NULL.
- **back_text**: TEXT, NOT NULL.
- **creation**: TEXT, NOT NULL, CHECK (creation IN ('ai', 'manual', 'ai-edited')).  -- Allowed values: 'ai', 'manual', 'ai-edited'.
- **generation_id**: UUID, NULL, foreign key referencing generations(id).
- **status**: BOOLEAN, NOT NULL  -- (true indicates "success", false indicates "failed").
- **created_at**: TIMESTAMPTZ, NOT NULL, default CURRENT_TIMESTAMP.
- **updated_at**: TIMESTAMPTZ, NOT NULL, default CURRENT_TIMESTAMP.

### Generations
- **id**: UUID, primary key, default generated value (e.g. uuid_generate_v4()).
- **user_id**: UUID, NOT NULL, foreign key referencing users(id).
- **model**: VARCHAR(255), NOT NULL.  -- Model name limited to 255 characters.
- **source_text_hash**: VARCHAR(128), NOT NULL.  -- Hash length limited to 128 characters.
- **generated_flashcards_count**: INTEGER, NOT NULL, CHECK (generated_flashcards_count >= 0).  -- Must be zero or positive.
- **created_at**: TIMESTAMPTZ, NOT NULL, default CURRENT_TIMESTAMP.

### Generation Error Logs
- **model**: VARCHAR(255), NOT NULL.  -- Model name limited to 255 characters.
- **source_text_hash**: VARCHAR(128), NOT NULL.  -- Hash length limited to 128 characters.
- **source_text_length**: INTEGER, NOT NULL CHECK (source_text_length BETWEEN 1000 AND 10000).
- **error_code**: VARCHAR(100), NOT NULL.
- **error_message**: TEXT, NOT NULL.
- **created_at**: TIMESTAMPTZ, NOT NULL, default CURRENT_TIMESTAMP.

## 2. Relationships

- One-to-Many: One user can have many flashcards (flashcards.user_id references users(id)).
- One-to-Many: One user can have many generations (generations.user_id references users(id)).
- One-to-Many: One user can have many generation error logs.
- Optional: One flashcard can reference one generation (flashcards.generation_id references generations(id)).

## 3. Indexes

- Create an index on flashcards(user_id) to improve read performance:
  ```sql
  CREATE INDEX idx_flashcards_user_id ON flashcards(user_id);
  ```
- Create an index on flashcards(generation_id) to improve join performance:
  ```sql
  CREATE INDEX idx_flashcards_generation_id ON flashcards(generation_id);
  ```
- Create an index on generations(user_id) to improve read performance:
  ```sql
  CREATE INDEX idx_generations_user_id ON generations(user_id);
  ```
- Create an index on generation_error_logs(source_text_hash) to improve query performance:
  ```sql
  CREATE INDEX idx_generation_error_logs_source_text_hash ON generation_error_logs(source_text_hash);
  ```
- Primary key indexes are implicitly created on users(id), flashcards(id), and generations(id).

## 4. PostgreSQL Policies (RLS)

- Enable Row-Level Security (RLS) on users, flashcards, generations, and generation_error_logs tables. For example:
  ```sql
  ALTER TABLE users ENABLE ROW LEVEL SECURITY;
  ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
  ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
  ALTER TABLE generation_error_logs ENABLE ROW LEVEL SECURITY;
  ```
- Define RLS policies (using Supabase Auth guidelines) to restrict access so that users can only access their own data.

## 5. Additional Notes

- The schema uses UUIDs for primary keys to ensure high uniqueness and flexibility.
- The email column in the users table is unique, preventing duplicate account registrations.
- Timestamps (created_at and updated_at) help track record creation and modification. Application logic or triggers can be used to update the updated_at field automatically.
- The boolean status column in flashcards simplifies the logic for tracking the result of a learning session.
- This design is normalized (up to 3NF) to ensure data integrity and optimized for read-heavy operations as required by the PRD.
- New tables (generations and generation_error_logs) allow tracking of flashcard generation events and errors, improving statistics and error monitoring. 