import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const go = async () => {
      // Dá um tempinho para o Supabase processar o token da URL
      await new Promise((r) => setTimeout(r, 600));

      // Checa se a sessão foi criada
      const { data: { session } } = await supabase.auth.getSession();

      // Redireciona conforme o resultado
      if (session) {
        router.replace('/app');
      } else {
        router.replace('/login');
      }
    };
    go();
  }, [router]);

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="card max-w-md w-full text-center">
        <h1 className="text-lg font-semibold">Entrando…</h1>
        <p className="text-sm text-gray-600">Aguarde um instante.</p>
      </div>
    </div>
  );
}
