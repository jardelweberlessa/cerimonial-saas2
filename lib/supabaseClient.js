// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Evita quebrar caso as envs não estejam setadas
if (!url || !anon) {
  // Não lança erro no build, apenas avisa no log do navegador
  if (typeof window !== 'undefined') {
    console.warn('Supabase envs ausentes: verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY na Vercel.');
  }
}

export const supabase = createClient(url || '', anon || '');
