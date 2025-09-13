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
    <div style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:16,fontFamily:'system-ui,-apple-system,Segoe UI,Roboto'}}>
      <div style={{maxWidth:420,width:'100%',border:'1px solid #ddd',borderRadius:12,padding:16}}>
        <h1 style={{fontSize:20,fontWeight:600}}>Redefinir senha</h1>
        <p style={{fontSize:14,color:'#666',marginTop:6}}>{msg}</p>
        {ok && (
          <form onSubmit={submit} style={{marginTop:12,display:'grid',gap:8}}>
            <input type="password" placeholder="Nova senha (12+)" value={pwd1} onChange={e=>setPwd1(e.target.value)} required />
            <input type="password" placeholder="Repita a nova senha" value={pwd2} onChange={e=>setPwd2(e.target.value)} required />
            <button disabled={saving}>{saving ? 'Salvando…' : 'Salvar'}</button>
          </form>
        )}
      </div>
    </div>
  );
}
