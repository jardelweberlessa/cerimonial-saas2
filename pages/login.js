import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import Toast from '../components/Toast'; // se não tiver, remova

function normalizeBaseUrl(input) {
  let url = (input || '').trim();
  if (!url) return '';
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  return url.replace(/\/+$/, '');
}

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState('password'); // 'password' | 'signup' | 'magic'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/app');
    });
  }, [router]);

  const onLoginPassword = async (e) => {
    e.preventDefault();
    try {
      setSending(true);
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      router.replace('/app');
    } catch (err) { setToast({ text: 'Erro ao entrar: ' + err.message, type: 'error' }); }
    finally { setSending(false); }
  };

  const onSignup = async (e) => {
    e.preventDefault();
    try {
      setSending(true);
      const { error } = await supabase.auth.signUp({ email: email.trim(), password });
      if (error) throw error;
      setToast({ text: 'Cadastro criado! Faça login com sua senha.' });
      setMode('password');
    } catch (err) { setToast({ text: 'Erro no cadastro: ' + err.message, type: 'error' }); }
    finally { setSending(false); }
  };

  const onMagic = async (e) => {
    e.preventDefault();
    try {
      setSending(true);
      let base = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || '');
      if (process.env.NEXT_PUBLIC_SITE_URL) base = process.env.NEXT_PUBLIC_SITE_URL;
      const siteBase = normalizeBaseUrl(base);
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${siteBase}/auth/callback` }
      });
      if (error) throw error;
      setToast({ text: 'Enviamos um link para seu e-mail.' });
    } catch (err) { setToast({ text: 'Erro ao enviar link: ' + err.message, type: 'error' }); }
    finally { setSending(false); }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="card max-w-md w-full grid gap-3">
        <h1 className="text-xl font-semibold text-center">Entrar</h1>
        <div className="flex justify-center gap-2 text-sm">
          <button className={`btn ${mode==='password'?'':''}`} onClick={()=>setMode('password')}>Com senha</button>
          <button className={`btn ${mode==='signup'?'':''}`} onClick={()=>setMode('signup')}>Criar conta</button>
          <button className={`btn ${mode==='magic'?'':''}`} onClick={()=>setMode('magic')}>Link por e-mail</button>
        </div>

        {mode === 'password' && (
          <form onSubmit={onLoginPassword} className="grid gap-3">
            <input className="input" type="email" placeholder="voce@exemplo.com" value={email} onChange={e=>setEmail(e.target.value)} required />
            <input className="input" type="password" placeholder="Sua senha" value={password} onChange={e=>setPassword(e.target.value)} required />
            <button className="btn" disabled={sending}>{sending?'Entrando…':'Entrar'}</button>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={onSignup} className="grid gap-3">
            <input className="input" type="email" placeholder="voce@exemplo.com" value={email} onChange={e=>setEmail(e.target.value)} required />
            <input className="input" type="password" placeholder="Crie uma senha" value={password} onChange={e=>setPassword(e.target.value)} required />
            <button className="btn" disabled={sending}>{sending?'Criando…':'Criar conta'}</button>
          </form>
        )}

        {mode === 'magic' && (
          <form onSubmit={onMagic} className="grid gap-3">
            <input className="input" type="email" placeholder="voce@exemplo.com" value={email} onChange={e=>setEmail(e.target.value)} required />
            <button className="btn" disabled={sending}>{sending?'Enviando…':'Enviar link mágico'}</button>
          </form>
        )}
      </div>
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </div>
  );
}
