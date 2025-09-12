import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AuthGuard({ children }) {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/login';
      } else {
        setOk(true);
      }
    })();
  }, []);

  if (!ok) return <div className="container py-8">Carregando...</div>;
  return children;
}
