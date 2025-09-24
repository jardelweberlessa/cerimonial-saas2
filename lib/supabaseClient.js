import { createClient } from '@supabase/supabase-js';

// Cliente único (browser) – serve para as páginas em /pages
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Para compatibilidade com imports diferentes
export const supabaseBrowser = () => supabase;
export default supabase;
