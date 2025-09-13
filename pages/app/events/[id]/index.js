import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';

export default function EventsIndex() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [me, setMe] = useState(null);
  const [form, setForm] = useState({ name: '', event_date: '', venue: '' });
  const [msg, setMsg] = useState(null);

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

  useEffect(() => {
    const boot = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }
      setMe(user.email || null);
      await load();
    };
    boot();
  }, []);

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
      const { data: created, error: insErr } = await supabase
        .from('events')
        .insert(payload)
        .select('id')
        .single();
      if (insErr) throw insErr;
      // opcional: marcar também como membro 'owner'
      if (created?.id) {
        await supabase.from('event_members').insert({
          event_id: created.id,
          member_email: ownerEmail,
          role: 'owner'
        });
      }
      setForm({ name: '', event_date: '', venue: '' });
      await load();
      setMsg('Evento criado!');
    } catch (err) {
      setMsg('Erro ao criar: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{display:'grid',gap:16,padding:16,fontFamily:'system-ui,-apple-system,Segoe UI,Roboto'}}>
      <div style={{border:'1px solid #ddd',borderRadius:12,padding:12}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8,flexWrap:'wrap'}}>
          <div>
            <h1 style={{fontSize:20,fontWeight:600}}>Eventos</h1>
            <p style={{fontSize:12,color:'#666'}}>Logado como: <b>{me || '—'}</b></p>
          </div>
          <Link href="/app"><span style={{padding:'8px 12px',border:'1px solid #ccc',borderRadius:8}}>Ir para o App</span></Link>
        </div>
      </div>

      <div style={{border:'1px solid #ddd',borderRadius:12,padding:12}}>
        <h2 style={{fontSize:12,color:'#666',marginBottom:8}}>Criar novo evento</h2>
        <form onSubmit={onCreate} style={{display:'grid',gap:8}}>
          <div>
            <div style={{fontSize:12,marginBottom:4}}>Nome do evento</div>
            <input placeholder="Ex.: Casamento Marina & Caio"
              value={form.name} onChange={e=>setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <div style={{fontSize:12,marginBottom:4}}>Data (opcional)</div>
            <input type="date"
              value={form.event_date} onChange={e=>setForm({ ...form, event_date: e.target.value })} />
          </div>
          <div>
            <div style={{fontSize:12,marginBottom:4}}>Local (opcional)</div>
            <input placeholder="Salão, igreja, cidade…"
              value={form.venue} onChange={e=>setForm({ ...form, venue: e.target.value })} />
          </div>
          <div>
            <button disabled={sending}>{sending ? 'Criando…' : 'Criar evento'}</button>
          </div>
        </form>
        {msg && <div style={{marginTop:8,fontSize:13}}>{msg}</div>}
      </div>

      <div style={{border:'1px solid #ddd',borderRadius:12,padding:12,overflowX:'auto'}}>
        <table style={{width:'100%',fontSize:14}}>
          <thead>
            <tr style={{color:'#666',borderBottom:'1px solid #eee',textAlign:'left'}}>
              <th style={{padding:'8px'}}>Nome</th>
              <th style={{padding:'8px'}}>Data</th>
              <th style={{padding:'8px'}}>Local</th>
              <th style={{padding:'8px'}}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="4" style={{padding:'16px',textAlign:'center',color:'#666'}}>Carregando…</td></tr>}
            {!loading && items.length === 0 && <tr><td colSpan="4" style={{padding:'16px',textAlign:'center',color:'#666'}}>Nenhum evento. Crie o primeiro acima ✨</td></tr>}
            {!loading && items.map(ev => (
              <tr key={ev.id} style={{borderBottom:'1px solid #f1f1f1'}}>
                <td style={{padding:'8px'}}>{ev.name}</td>
                <td style={{padding:'8px'}}>{ev.event_date || '—'}</td>
                <td style={{padding:'8px'}}>{ev.venue || '—'}</td>
                <td style={{padding:'8px'}}>
                  <Link href={`/app/events/${ev.id}`}><span style={{padding:'6px 10px',border:'1px solid #ccc',borderRadius:8}}>Abrir módulos</span></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
