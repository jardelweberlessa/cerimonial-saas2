import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

function normalizeBaseUrl(input) {
  let url = (input || '').trim();
  if (!url) return '';
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  return url.replace(/\/+$/, '');
}

function validateStrongPassword(pwd) {
  if (!pwd || pwd.length < 12) return 'Use ao menos 12 caracteres.';
  if (!/[a-z]/.test(pwd)) return 'Inclua pelo menos 1 letra minúscula.';
  if (!/[A-Z]/.test(pwd)) return 'Inclua pelo menos 1 letra maiúscula.';
  if (!/[0-9]/.test(pwd)) return 'Inclua pelo menos 1 número.';
  if (!/[^A-Za-z0-9]/.test(pwd)) return 'Inclua pelo menos 1 símbolo (ex.: !@#&*).';
  return null;
}

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupPwd, setSignupPwd] = useState('');
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
    const msg = validateStrongPassword(signupPwd);
    if (msg) return alert('Senha fraca: ' + msg);

    setSending(true);
    const { error } = await supabase.auth.signUp({ email: email.trim(), password: signupPwd });
    setSending(false);
    if (error) return alert('Erro no cadastro: ' + error.message);
    alert('Cadastro criado! Agora entre com sua senha na aba "Com senha".');
    setMode('password');
  };

  const onMagic = async (e) => {
    e.preventDefault();
    setSending(true);
    let base = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const site = normalizeBaseUrl(base);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${site}/auth/callback` }
    });
    setSending(false);
    if (error) return alert('Erro ao enviar link: ' + error.message);
    alert('Enviamos um link para seu e-mail.');
  };

  const forgot = async () => {
    if (!email.trim()) return alert('Digite seu e-mail no campo acima.');
    let base = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const site = normalizeBaseUrl(base);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${site}/auth/reset` });
    if (error) alert('Erro: ' + error.message);
    else alert('Enviamos um e-mail para redefinir sua senha.');
  };

  return (
    <div style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:16,fontFamily:'system-ui,-apple-system,Segoe UI,Roboto'}}>
      <div style={{maxWidth:420,width:'100%',border:'1px solid #ddd',borderRadius:12,padding:16,display:'grid',gap:12}}>
        <h1 style={{fontSize:20,fontWeight:600,textAlign:'center'}}>Entrar</h1>

        <div style={{display:'flex',justifyContent:'center',gap:8,flexWrap:'wrap'}}>
          <button onClick={()=>setMode('password')}>Com senha</button>
          <button onClick={()=>setMode('signup')}>Criar conta</button>
          <button onClick={()=>setMode('magic')}>Link por e-mail</button>
        </div>

        {mode === 'password' && (
          <form onSubmit={onLoginPassword} style={{display:'grid',gap:8}}>
            <input type="email" placeholder="voce@exemplo.com" value={email} onChange={e=>setEmail(e.target.value)} required />
            <input type="password" placeholder="Sua senha" value={password} onChange={e=>setPassword(e.target.value)} required />
            <button disabled={sending}>{sending ? 'Entrando…' : 'Entrar'}</button>
            <button type="button" onClick={forgot} style={{color:'#2563eb',background:'none',border:'none'}}>Esqueci minha senha</button>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={onSignup} style={{display:'grid',gap:8}}>
            <input type="email" placeholder="voce@exemplo.com" value={email} onChange={e=>setEmail(e.target.value)} required />
            <input type="password" placeholder="Crie uma senha forte (12+ com Aa1!)" value={signupPwd} onChange={e=>setSignupPwd(e.target.value)} required />
            <button disabled={sending}>{sending ? 'Criando…' : 'Criar conta'}</button>
            <div style={{fontSize:12,color:'#666'}}>Use 12+ caracteres com maiúsculas, minúsculas, número e símbolo.</div>
          </form>
        )}

        {mode === 'magic' && (
          <form onSubmit={onMagic} style={{display:'grid',gap:8}}>
            <input type="email" placeholder="voce@exemplo.com" value={email} onChange={e=>setEmail(e.target.value)} required />
            <button disabled={sending}>{sending ? 'Enviando…' : 'Enviar link mágico'}</button>
          </form>
        )}
      </div>
    </div>
  );
}
