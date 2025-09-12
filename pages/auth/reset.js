// pages/auth/reset.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

export default function ResetPassword() {
  const router = useRouter();
  const [pwd1, setPwd1] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [msg, setMsg] = useState('Verificando link…');
  const [ok, setOk] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { setOk(true); setMsg('Defina sua nova senha abaixo.'); }
      else { setMsg('Link inválido ou expirado. Peça novamente em "Esqueci a senha".'); }
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!pwd1 || !pwd2) return setMsg('Preencha a senha duas vezes.');
    if (pwd1 !== pwd2) return setMsg('As senhas não conferem.');
    try {
      setSaving(true);
      const { error } = await supabase.auth.updateUser({ password: pwd1 });
      if (error) throw error;
      setMsg('Senha atualizada! Você já pode entrar.');
      setTimeout(() => router.replace('/login'), 900);
    } catch (err) { setMsg('Erro: ' + err.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="card max-w-md w-full">
        <h1 className="text-xl font-semibold">Redefinir senha</h1>
        <p className="text-sm text-gray-600 mt-1">{msg}</p>
        {ok && (
          <form onSubmit={submit} className="mt-4 grid gap-3">
            <input className="input" type="password" placeholder="Nova senha (12+ caracteres)" value={pwd1} onChange={e=>setPwd1(e.target.value)} required />
            <input className="input" type="password" placeholder="Repita a nova senha" value={pwd2} onChange={e=>setPwd2(e.target.value)} required />
            <button className="btn" disabled={saving}>{saving ? 'Salvando…' : 'Salvar'}</button>
          </form>
        )}
      </div>
    </div>
  );
}
