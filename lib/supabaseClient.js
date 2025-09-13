// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  if (typeof window !== 'undefined') {
    console.warn('Supabase envs ausentes: verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY na Vercel.');
  }
}

export const supabase = createClient(url || '', anon || '');

// também exporta como default para capturar imports "default"
export default supabase;
