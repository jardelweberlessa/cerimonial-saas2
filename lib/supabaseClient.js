// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  // fallback: tenta rodar sem env (útil no celular)
  console.warn('Supabase env vars ausentes. Defina em Vercel quando puder.');
}

export const supabase = createClient(url || '', anon || '');
