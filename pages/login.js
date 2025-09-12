// pages/login.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/app');
    });
  }, [router]);

  const onLoginPassword = async (e) => {
    e.preventDefault();
    setSending(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setSending(false);
    if (error) return alert('Erro ao entrar: ' + error.message);
    router.replace('/app');
  };

  const onSignup = async (e) => {
    e.preventDefault();
    setSending(true);
    const { error } = await supabase.auth.signUp({ email: email.trim(), password });
    setSending(false);
    if (error) return alert('Erro no cadastro: ' + error.message);
    alert('Cadastro criado! Agora entre com sua senha na aba "Com senha".');
    setMode('password');
  };

  const onMagic = async (e) => {
    e.preventDefault();
    setSending(true);
    let base = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const siteBase = normalizeBaseUrl(base);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${siteBase}/auth/callback` }
    });
    setSending(false);
    if (error) return alert('Erro ao enviar link: ' + error.message);
    alert('Enviamos um link para seu e-mail.');
  };

  const forgot = async () => {
    if (!email.trim()) return alert('Digite seu e-mail no campo acima.');
    let base = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const site = normalizeBaseUrl(base);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${site}/auth/reset`
    });
    if (error) alert('Erro: ' + error.message);
    else alert('Enviamos um e-mail para redefinir sua senha.');
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="card max-w-md w-full grid gap-3">
        <h1 className="text-xl font-semibold text-center">Entrar</h1>

        <div className="flex justify-center gap-2 text-sm">
          <button className="btn" onClick={()=>setMode('password')}>Com senha</button>
          <button className="btn" onClick={()=>setMode('signup')}>Criar conta</button>
          <button className="btn" onClick={()=>setMode('magic')}>Link por e-mail</button>
        </div>

        {mode === 'password' && (
          <form onSubmit={onLoginPassword} className="grid gap-3">
            <input className="input" type="email" placeholder="voce@exemplo.com" value={email} onChange={e=>setEmail(e.target.value)} required />
            <input className="input" type="password" placeholder="Sua senha" value={password} onChange={e=>setPassword(e.target.value)} required />
            <button className="btn" disabled={sending}>{sending ? 'Entrando…' : 'Entrar'}</button>
            <button type="button" className="text-sm text-blue-600" onClick={forgot}>Esqueci minha senha</button>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={onSignup} className="grid gap-3">
            <input className="input" type="email" placeholder="voce@exemplo.com" value={email} onChange={e=>setEmail(e.target.value)} required />
            <input className="input" type="password" placeholder="Crie uma senha (12+ caracteres)" value={password} onChange={e=>setPassword(e.target.value)} required />
            <button className="btn" disabled={sending}>{sending ? 'Criando…' : 'Criar conta'}</button>
          </form>
        )}

        {mode === 'magic' && (
          <form onSubmit={onMagic} className="grid gap-3">
            <input className="input" type="email" placeholder="voce@exemplo.com" value={email} onChange={e=>setEmail(e.target.value)} required />
            <button className="btn" disabled={sending}>{sending ? 'Enviando…' : 'Enviar link mágico'}</button>
          </form>
        )}
      </div>
    </div>
  );
}
