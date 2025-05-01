# REST API Plan

## 1. Resources
- **Users** (corresponds to the `Users` table):  
  Contains user account details such as `id`, `email`, `hashed_password`, and timestamps. Managed by Supabase with RLS enabled.

- **Flashcards** (corresponds to the `Flashcards` table):  
  Represents both manually created and AI-generated flashcards. Key fields include `id`, `user_id`, `front_text`, `back_text`, `creation` (with allowed values: `'ai'`, `'manual'`, `'ai-edited'`), `generation_id`, and a boolean `status`.

- **Generations** (corresponds to the `Generations` table):  
  Holds records of AI flashcard generation events. Key fields include `id`, `user_id`, `model`, `source_text_hash`, and `generated_flashcards_count`.

- **Generation Error Logs** (corresponds to the `Generation Error Logs` table):  
  Stores error logs related to flashcard generation events. Important fields include `source_text_length` (validated between 1000 and 10000), `error_code`, and `error_message`.

- **Authentication** (auxiliary resource):  
  Even though user details are in the Users table, authentication endpoints are required for registration, login, and logout.

- **Learning Session** (optional resource):  
  This may be used for exposing flashcards that are scheduled for spaced repetition, based on user interactions.

---

## 2. Endpoints

### Authentication Endpoints
- **POST /api/auth/register**  
  *Description*: Register a new user account.  
  *Request Payload*:
  ```json
  {
    "email": "user@example.com",
    "password": "yourPassword123"
  }
  ```  
  *Response*:
    - 201 Created: Returns user info and authentication token.
    - 400 Bad Request: Invalid email/password format.

- **POST /api/auth/login**  
  *Description*: Log in an existing user.  
  *Request Payload*:
  ```json
  {
    "email": "user@example.com",
    "password": "yourPassword123"
  }
  ```  
  *Response*:
    - 200 OK: Returns an authentication token and user details.
    - 401 Unauthorized: Incorrect credentials.

- **POST /api/auth/logout**  
  *Description*: Log out the current session.  
  *Response*:
    - 200 OK: Successful logout.

- **GET /api/users/me**  
  *Description*: Retrieve details of the currently authenticated user.  
  *Response*:
    - 200 OK: User details.
    - 401 Unauthorized: Missing or invalid token.

---

### Flashcards Endpoints
- **GET /api/flashcards**  
  *Description*: Retrieve a paginated list of flashcards for the authenticated user.  
  *Query Parameters*:
    - `page` (number)
    - `limit` (number)
    - Optionally filter by attributes (e.g., `creation`, `status`) or sort by `created_at`.  
      *Response*:
    - 200 OK: A list of flashcards.

- **GET /api/flashcards/{id}**  
  *Description*: Retrieve details of a specific flashcard.  
  *Response*:
    - 200 OK: Flashcard object.
    - 404 Not Found: Flashcard does not exist or does not belong to the user.

- **POST /api/flashcards**  
  *Description*: Create a new flashcard manually.  
  *Request Payload*:
  ```json
  {
    "front_text": "Question text",
    "back_text": "Answer text"
  }
  ```  
  *Note*: The API should automatically set the `creation` field to `"manual"`.  
  *Response*:
    - 201 Created: Returns the created flashcard.
    - 400 Bad Request: Validation error.

- **PUT /api/flashcards/{id}**  
  *Description*: Update an existing flashcard.  
  *Request Payload* (example):
  ```json
  {
    "front_text": "Updated question text",
    "back_text": "Updated answer text"
  }
  ```  
  *Note*: If the flashcard originates from an AI generation and is edited, the API may set the `creation` field to `"ai-edited"`.  
  *Response*:
    - 200 OK: Returns the updated flashcard.
    - 400 Bad Request / 404 Not Found as appropriate.

- **DELETE /api/flashcards/{id}**  
  *Description*: Delete an existing flashcard.  
  *Response*:
    - 200 OK: Deletion confirmation.
    - 404 Not Found: Flashcard does not exist or access is unauthorized.

- **POST /api/flashcards/generate**  
  *Description*: Generate flashcard suggestions using an AI model.  
  *Request Payload*:
  ```json
  {
    "source_text": "A long text input with between 1000 and 10000 characters",
    "model": "optional model identifier (if applicable)"
  }
  ```  
  *Validations*:
    - `source_text` must be between 1000 and 10000 characters.
      *Process*:
    - The endpoint calls the configured LLM API.
    - A new `Generation` record is created.
    - On success, suggested flashcards with the `creation` field set to `"ai"` are returned.
    - In case of errors, an error log is created in the `Generation Error Logs` table.
      *Response*:
    - 200 OK: Returns an object containing the `generation_id` and an array of flashcard suggestions.
    - 400 Bad Request / 500 Internal Server Error: With error details.

---

### Generations Endpoints
- **GET /api/generations**  
  *Description*: Retrieve a paginated list of flashcard generation events for the authenticated user.  
  *Response*:
    - 200 OK: List of generation events.

- **GET /api/generations/{id}**  
  *Description*: Retrieve detailed information about a specific generation event.  
  *Response*:
    - 200 OK: Generation event details.
    - 404 Not Found if not found or not owned by the user.

---

### Generation Error Logs Endpoints
- **GET /api/generation-error-logs**  
  *Description*: Retrieve a paginated list of generation error logs for the authenticated user.  
  *Response*:
    - 200 OK: List of error logs.

- **GET /api/generation-error-logs/{id}**  
  *Description*: Retrieve details of a specific generation error log.  
  *Response*:
    - 200 OK: Error log details.
    - 404 Not Found if not found or not owned by the user.

---

### Learning Session Endpoints (Optional)
- **GET /api/learning/sessions**  
  *Description*: Retrieve flashcards scheduled for a spaced repetition learning session.  
  *Response*:
    - 200 OK: List of flashcards for review.

- **POST /api/learning/sessions/{card_id}/review**  
  *Description*: Submit review feedback for a flashcard in a learning session (e.g., rating recall quality).  
  *Request Payload*:
  ```json
  {
    "rating": "numeric value representing user performance"
  }
  ```  
  *Response*:
    - 200 OK: Confirmation of review submission.

---

### Additional Endpoints
- **GET /api/health**  
  *Description*: Health check endpoint to verify that the API is running.  
  *Response*:
    - 200 OK: Health status message.

---

## 3. Authentication and Authorization
- **Mechanism**: The API will use JWT (JSON Web Tokens) for authentication.
- **Implementation**:
    - Upon logging in or registering, the API issues a JWT token.
    - All protected endpoints must include the token in the HTTP Authorization header (e.g., `Authorization: Bearer <token>`).
    - The database’s Row-Level Security (RLS) complements the token-based checks by ensuring users can only access their own data.
- **Security Measures**:
    - Rate limiting middleware to prevent abuse.
    - HTTPS enforced in production.
    - Input validation to prevent injection attacks.

---

## 4. Validation and Business Logic
- **Input Validations**:
    - **User Registration/Login**: Validate email format and password strength.
    - **Flashcard Creation/Update**: Ensure `front_text` and `back_text` are provided and non-empty.
    - **Flashcard Generation**: `source_text` length must be within 1000–10000 characters. The `creation` field is strictly limited to the allowed values (`"ai"`, `"manual"`, `"ai-edited"`).
    - **Generation Records**: `generated_flashcards_count` must be a non-negative integer.
- **Business Logic**:
    - **Automatic Generation**:
        - When a flashcard generation request is made, the API interacts with an external LLM.
        - On success, a `Generation` record is created and associated flashcards are returned with `creation` set to `"ai"`.
        - On failure, error details are recorded in the `Generation Error Logs` table.
    - **Manual Creation**: Automatically sets the `creation` field to `"manual"`.
    - **Editing**: If a flashcard generated via AI is modified, it can be flagged as `"ai-edited"`.
    - **Listing and Pagination**: Support for pagination, filtering, and sorting to efficiently handle large data sets.
    - **Learning Session**: (Optional) Integration with a spaced repetition algorithm for scheduling reviews.

---

## 5. Performance and Security Considerations
- **Indexes**:
    - Use indexes defined in the schema (e.g., `idx_flashcards_user_id`, `idx_generations_user_id`) to ensure efficient database queries.
- **Pagination and Filtering**:
    - Endpoints returning lists (flashcards, generations, error logs) will include parameters for pagination and filtering to minimize payload size.
- **Rate Limiting and Error Handling**:
    - Implement rate limiting on authentication and data-modifying endpoints.
    - Return proper HTTP status codes with descriptive error messages (e.g., 400, 401, 404, 500).
- **Data Security**:
    - All endpoints require authentication with JWT.
    - Sensitive actions (creation, editing, deletion) verify that data belongs to the authenticated user.

---

## 6. Assumptions and Additional Considerations
- The API is designed to work with the following tech stack: Astro 5, React 19, TypeScript 5, Tailwind 4, Shadcn/ui, and Supabase as the backend.
- It is assumed that the front-end will handle user interactions (e.g., accepting or rejecting AI-generated flashcards) while the API provides CRUD and aggregation operations.
- Spaced repetition logic in learning sessions might evolve into a dedicated service or endpoint in the future.
- The API plan is constructed with scalability, security, and maintainability in mind, ensuring smooth integration with the rest of the application ecosystem.
- 