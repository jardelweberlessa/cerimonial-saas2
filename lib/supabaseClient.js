import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Se as variáveis não estiverem definidas ainda, evita crash em build
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local antes de usar o login.');
}

export const supabase = createClient(supabaseUrl || 'http://localhost', supabaseAnonKey || 'anon_key_placeholder');
