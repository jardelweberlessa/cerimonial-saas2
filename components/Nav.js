import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function Nav() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session || null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => setSession(sess));
    return () => sub.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <header className="bg-white/80 backdrop-blur border-b sticky top-0 z-20">
      <div className="container py-3 flex items-center gap-4">
        <Link className="font-semibold" href="/">Cerimonial SaaS</Link>
        <nav className="ml-auto flex gap-3">
          <Link className="text-sm" href="/app">App</Link>
          {session ? (
            <button onClick={logout} className="text-sm text-red-600">Sair</button>
          ) : (
            <Link className="text-sm" href="/login">Entrar</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
