// pages/app/events/index.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';

/**
 * Página de Eventos
 * - Lista eventos do usuário logado (RLS cuida do filtro no Supabase).
 * - Form para criar novo evento (usa owner_email = seu e-mail).
 * - Link para abrir módulos do evento (/app/events/[id]).
 *
 * Requisitos:
 *  - lib/supabaseClient.js configurado
 *  - Tabela public.events com colunas: id (uuid), name (text), owner_email (text), event_date (date, opcional), venue (text, opcional), created_at (timestamp)
 *  - (Opcional) Tabela public.event_members (event_id uuid, member_email text, role text)
 *  - Políticas RLS de select e insert adequadas.
 */

export default function EventsIndex() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [me, setMe] = useState(null);
  const [msg, setMsg] = useState(null);
  const [form, setForm] = useState({
    name: '',
    event_date: '',
    venue: ''
  });

  // Carrega eventos visíveis ao usuário (RLS controla)
  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setMsg('Erro ao carregar: ' + error.message);
    setItems(data || []);
    setLoading(false);
  };

  // Boot: garante usuário logado e carrega lista
  useEffect(() => {
    const boot = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // não logado → manda para login
        if (typeof window !== 'undefined') window.location.href = '/login';
        return;
      }
      setMe(user.email || null);
      await load();
    };
    boot();
  }, []);

  // Criar evento
  const onCreate = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (!form.name.trim()) return setMsg('Dê um nome ao evento.');
    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const ownerEmail = user?.email;
      if (!ownerEmail) throw new Error('Sessão não encontrada. Faça login novamente.');

      const payload = {
        name: form.name.trim(),
        owner_email: ownerEmail,
        event_date: form.event_date || null,
        venue: form.venue || null
      };

      // Insere e retorna o id
      const { data: created, error: insErr } = await supabase
        .from('events')
        .insert(payload)
        .select('id')
        .single();

      if (insErr) throw insErr;

      // (Opcional) adiciona você como membro 'owner' — útil p/ policies futuras
      if (created?.id) {
        await supabase.from('event_members').insert({
          event_id: created.id,
          member_email: ownerEmail,
          role: 'owner'
        });
      }

      // Limpa formulário e recarrega
      setForm({ name: '', event_date: '', venue: '' });
      await load();
      setMsg('Evento criado!');
    } catch (err) {
      setMsg('Erro ao criar: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  // UI simples (inline styles para funcionar sem Tailwind)
  return (
    <div style={{display:'grid',gap:16,padding:16,fontFamily:'system-ui,-apple-system,Segoe UI,Roboto'}}>
      {/* Cabeçalho */}
      <div style={{border:'1px solid #ddd',borderRadius:12,padding:12}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8,flexWrap:'wrap'}}>
          <div>
            <h1 style={{fontSize:20,fontWeight:600}}>Eventos</h1>
            <p style={{fontSize:12,color:'#666'}}>Logado como: <b>{me || '—'}</b></p>
          </div>
          <Link href="/app">
            <span style={{padding:'8px 12px',border:'1px solid #ccc',borderRadius:8,textDecoration:'none'}}>Ir para o App</span>
          </Link>
        </div>
      </div>

      {/* Criar novo evento */}
      <div style={{border:'1px solid #ddd',borderRadius:12,padding:12}}>
        <h2 style={{fontSize:12,color:'#666',marginBottom:8}}>Criar novo evento</h2>
        <form onSubmit={onCreate} style={{display:'grid',gap:10}}>
          <div>
            <div style={{fontSize:12,marginBottom:4}}>Nome do evento</div>
            <input
              placeholder="Ex.: Casamento Marina & Caio"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              style={{width:'100%',padding:'8px',border:'1px solid #ccc',borderRadius:8}}
            />
          </div>

          <div>
            <div style={{fontSize:12,marginBottom:4}}>Data (opcional)</div>
            <input
              type="date"
              value={form.event_date}
              onChange={e => setForm({ ...form, event_date: e.target.value })}
              style={{width:'100%',padding:'8px',border:'1px solid #ccc',borderRadius:8}}
            />
          </div>

          <div>
            <div style={{
