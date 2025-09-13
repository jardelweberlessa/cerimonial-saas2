// pages/auth/reset.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

export default function ResetPassword(){
  const router = useRouter();
  const [pwd1, setPwd1] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [ok, setOk] = useState(false);
  const [msg, setMsg] = useState('Verificando link…');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { setOk(true); setMsg('Defina a nova senha.'); }
      else { setMsg('Link inválido/expirado.'); }
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (pwd1 !== pwd2) return setMsg('Senhas não conferem.');
    try {
      setSaving(true);
      const { error } = await supabase.auth.updateUser({ password: pwd1 });
      if (error) throw error;
      setMsg('Senha atualizada!');
      setTimeout(() => router.replace('/login'), 900);
    } catch (err) {
      setMsg('Erro: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:16}}>
      <div style={{maxWidth:420,width:'100%'}}>
        <h1>Redefinir senha</h1>
        <p>{msg}</p>
        {ok && (
          <form onSubmit={submit} style={{display:'grid',gap:8}}>
            <input type="password" placeholder="Nova senha" value={pwd1} onChange={e=>setPwd1(e.target.value)} required />
            <input type="password" placeholder="Repita a senha" value={pwd2} onChange={e=>setPwd2(e.target.value)} required />
            <button disabled={saving}>{saving ? 'Salvando…' : 'Salvar'}</button>
          </form>
        )}
      </div>
    </div>
  );
}
