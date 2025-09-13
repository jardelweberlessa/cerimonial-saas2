// pages/app/events/index.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../lib/supabaseClient';

export default function EventsIndex() {
  const router = useRouter();

  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState(null);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: '',
    event_date: '',
    venue: ''
  });

  // Carrega sessão e eventos
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.replace('/login');
      setMe(session.user?.email || null);

      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) setMsg('Erro ao listar: ' + error.message + ' (code: ' + (error.code || 'n/a') + ')');
      setList(data || []);
      setLoading(false);
    })();
  }, [router]);

  // Cria evento
  const createEvent = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!form.name.trim()) {
      setMsg('Dê um nome ao evento.'); 
      return;
    }

    setSending(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.replace('/login');

      // Monta payload: event_date é opcional; se vazio, manda null
      const payload = {
        name: form.name.trim(),
        owner_email: session.user.email,
        event_date: form.event_date ? form.event_date : null,
        venue: form.venue ? form.venue.trim() : null
      };

      const { data, error } = await supabase
        .from('events')
        .insert(payload)
        .select('id')
        .single();

      if (error) {
        // Mostra tudo que ajuda a depurar
        throw new Error(`${error.message} (code: ${error.code || 'n/a'})`);
      }

      // adiciona o criador como membro (caso não exista trigger)
      if (data?.id) {
        await supabase.from('event_members').insert({
          event_id: data.id,
          member_email: session.user.email,
          role: 'owner'
        });
      }

      // limpa form e recarrega lista
      setForm({ name: '', event_date: '', venue: '' });
      const { data: dataList } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      setList(dataList || []);
      setMsg('Evento criado!');
    } catch (err) {
      setMsg('Erro ao criar: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{padding:16,fontFamily:'system-ui,-apple-system,Segoe UI,Roboto',display:'grid',gap:16}}>
      <div style={{border:'1px solid #ddd',borderRadius:12,padding:12}}>
        <h1 style={{fontSize:20,margin:0}}>Eventos</h1>
        <div style={{fontSize:12,color:'#666'}}>Logado como: <b>{me || '—'}</b></div>
      </div>

      <div style={{border:'1px solid #ddd',borderRadius:12,padding:12}}>
        <h2 style={{fontSize:14,margin:'0 0 8px 0',color:'#555'}}>Criar novo evento</h2>
        <form onSubmit={createEvent} style={{display:'grid',gap:10}}>
          <div>
            <div style={{fontSize:12,marginBottom:4}}>Nome do evento *</div>
            <input
              value={form.name}
              onChange={e=>setForm({...form, name: e.target.value})}
              placeholder="Ex.: Casamento Marina & Caio"
              required
              style={{width:'100%',padding:'8px',border:'1px solid #ccc',borderRadius:8}}
            />
          </div>
          <div>
            <div style={{fontSize:12,marginBottom:4}}>Data (opcional)</div>
            <input
              type="date"
              value={form.event_date}
              onChange={e=>setForm({...form, event_date: e.target.value})}
              style={{width:'100%',padding:'8px',border:'1px solid #ccc',borderRadius:8}}
            />
          </div>
          <div>
            <div style={{fontSize:12,marginBottom:4}}>Local (opcional)</div>
            <input
              value={form.venue}
              onChange={e=>setForm({...form, venue: e.target.value})}
              placeholder="Salão, igreja, cidade…"
              style={{width:'100%',padding:'8px',border:'1px solid #ccc',borderRadius:8}}
            />
          </div>
          <div>
            <button disabled={sending} style={{padding:'10px 14px',border:'1px solid #ccc',borderRadius:8}}>
              {sending ? 'Criando…' : 'Criar evento'}
            </button>
          </div>
        </form>
        {msg && <div style={{marginTop:8,fontSize:13}}>{msg}</div>}
      </div>

      <div style={{border:'1px solid #ddd',borderRadius:12,padding:12,overflowX:'auto'}}>
        <table style={{width:'100%',fontSize:14,borderCollapse:'collapse'}}>
          <thead>
            <tr style={{borderBottom:'1px solid #eee',color:'#666',textAlign:'left'}}>
              <th style={{padding:'8px'}}>Nome</th>
              <th style={{padding:'8px'}}>Data</th>
              <th style={{padding:'8px'}}>Local</th>
              <th style={{padding:'8px'}}>Criado em</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan="4" style={{padding:'14px',textAlign:'center',color:'#666'}}>Carregando…</td></tr>
            )}
            {!loading && list.length === 0 && (
              <tr><td colSpan="4" style={{padding:'14px',textAlign:'center',color:'#666'}}>Nenhum evento ainda.</td></tr>
            )}
            {!loading && list.map(ev => (
              <tr key={ev.id} style={{borderBottom:'1px solid #f1f1f1'}}>
                <td style={{padding:'8px'}}>{ev.name}</td>
                <td style={{padding:'8px'}}>{ev.event_date || '—'}</td>
                <td style={{padding:'8px'}}>{ev.venue || '—'}</td>
                <td style={{padding:'8px'}}>{ev.created_at ? new Date(ev.created_at).toLocaleString('pt-BR') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
