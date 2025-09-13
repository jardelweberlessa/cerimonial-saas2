import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();
  useEffect(() => {
    const go = async () => {
      await new Promise(r => setTimeout(r, 600));
      const { data: { session } } = await supabase.auth.getSession();
      router.replace(session ? '/app' : '/login');
    };
    go();
  }, [router]);

  return (
    <div style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:16,fontFamily:'system-ui,-apple-system,Segoe UI,Roboto'}}>
      <div style={{maxWidth:420,width:'100%',border:'1px solid #ddd',borderRadius:12,padding:16,textAlign:'center'}}>
        <h1 style={{fontSize:18,fontWeight:600}}>Entrando…</h1>
        <p style={{fontSize:14,color:'#666'}}>Aguarde um instante.</p>
      </div>
    </div>
  );
}
