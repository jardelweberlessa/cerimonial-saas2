// pages/login.js (trechos principais)
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

function normalizeBaseUrl(input){let url=(input||'').trim();if(!url)return'';if(!/^https?:\/\//i.test(url))url='https://'+url;return url.replace(/\/+$/,'');}

export default function Login(){
  const router=useRouter();
  const [mode,setMode]=useState('password');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [sending,setSending]=useState(false);

  useEffect(()=>{supabase.auth.getSession().then(({data:{session}})=>{if(session)router.replace('/app/events');});},[router]);

  const onLoginPassword=async(e)=>{
    e.preventDefault(); setSending(true);
    const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});
    setSending(false);
    if(error) return alert('Erro ao entrar: '+error.message);
    router.replace('/app/events'); // <- AQUI
  };

  const onMagic=async(e)=>{
    e.preventDefault(); setSending(true);
    let base=process.env.NEXT_PUBLIC_SITE_URL||(typeof window!=='undefined'?window.location.origin:'');
    const site=normalizeBaseUrl(base);
    const {error}=await supabase.auth.signInWithOtp({email:email.trim(),options:{emailRedirectTo:`${site}/auth/callback`}});
    setSending(false);
    if(error) return alert('Erro ao enviar link: '+error.message);
    alert('Enviamos um link para seu e-mail.');
  };

  // … (mantenha o restante como já está)
  return (/* sua UI atual */);
}
