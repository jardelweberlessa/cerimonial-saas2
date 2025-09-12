import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const signIn = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.origin + '/app' : undefined }
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err.message || 'Erro ao enviar link de login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-xl font-semibold">Entrar</h1>
      <p className="text-sm text-gray-600 mt-1">Informe seu e-mail para receber um link mágico de acesso.</p>
      <form onSubmit={signIn} className="mt-4 grid gap-3">
        <label className="label">E-mail</label>
        <input className="input" type="email" placeholder="voce@exemplo.com" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <button className="btn" disabled={loading}>{loading ? 'Enviando...' : 'Enviar link de acesso'}</button>
      </form>
      {sent && <div className="mt-3 text-green-600 text-sm">Cheque sua caixa de e-mail e clique no link para entrar.</div>}
      {error && <div className="mt-3 text-red-600 text-sm">{error}</div>}
    </div>
  );
}
