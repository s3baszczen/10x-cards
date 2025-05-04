import { defineMiddleware } from 'astro:middleware';
import { supabaseClient } from '../db/supabase.client';

// Protected routes that require authentication
const protectedRoutes = ['/flashcards', '/generate'];

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.supabase = supabaseClient;

  const { pathname } = new URL(context.request.url);
  
  // Check if the route needs authentication
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (!session) {
      return context.redirect('/auth/login');
    }
  }

  return next();
});