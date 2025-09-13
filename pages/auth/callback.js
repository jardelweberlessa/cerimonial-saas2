// pages/auth/callback.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

export default function AuthCallback(){
  const router = useRouter();
  useEffect(() => {
    (async () => {
      await new Promise(r => setTimeout(r, 600));
      const { data: { session } } = await supabase.auth.getSession();
      router.replace(session ? '/app/events' : '/login');
    })();
  }, [router]);
  return <div style={{minHeight:'100vh',display:'grid',placeItems:'center'}}>Entrando…</div>;
}
