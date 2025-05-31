import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/db/database.types";

interface ErrorLogEntry {
  error_code: string;
  error_message: string;
  generation_id?: string;
  model?: string;
  stack_trace?: string;
}

export class ErrorLoggingService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async logError(entry: ErrorLogEntry): Promise<void> {
    // Mock error logging for now
    console.error("Error logged:", entry);
  }
}

export const errorLoggingService = (supabase: SupabaseClient<Database>) => new ErrorLoggingService(supabase);
