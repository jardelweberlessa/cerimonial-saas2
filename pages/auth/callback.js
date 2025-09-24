import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

export default function Callback() {
  const router = useRouter();
  useEffect(() => {
    // dá um tempo pro supabase processar o hash do magic link e salvar a sessão
    const t = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.replace('/events');
      else router.replace('/login');
    }, 400);
    return () => clearTimeout(t);
  }, [router]);
  return <p style={{padding:20}}>Entrando…</p>;
}
