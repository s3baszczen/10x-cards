import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';

// Extend Vitest's expect with Testing Library's matchers
expect.extend({});

// Setup MSW server
export const server = setupServer();

beforeAll(() => {
  // Start MSW server before all tests
  server.listen({ onUnhandledRequest: 'error' });
});

afterAll(() => {
  // Clean up MSW server after all tests
  server.close();
});

afterEach(() => {
  // Clean up after each test
  cleanup();
  // Reset MSW handlers between tests
  server.resetHandlers();
});
