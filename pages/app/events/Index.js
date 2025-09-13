// pages/app/events/index.js
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function EventsIndex() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
        return;
      }
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) console.error(error);
      else setEvents(data || []);
      setLoading(false);
    })();
  }, [router]);

  const createEvent = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return router.replace('/login');
    const { error } = await supabase.from('events').insert([
      { name: newName.trim(), owner_email: session.user.email }
    ]);
    if (error) {
      alert('Erro: ' + error.message);
    } else {
      setNewName('');
      location.reload();
    }
  };

  return (
    <div style={{padding:20,fontFamily:'system-ui,-apple-system,Segoe UI,Roboto'}}>
      <h1 style={{fontSize:22,marginBottom:12}}>Meus Eventos</h1>
      {loading ? (
        <p>Carregando…</p>
      ) : (
        <>
          {events.length === 0 ? (
            <p>Nenhum evento criado ainda.</p>
          ) : (
            <ul style={{marginBottom:16}}>
              {events.map(ev => (
                <li key={ev.id} style={{marginBottom:8}}>
                  <b>{ev.name}</b> — {new Date(ev.created_at).toLocaleDateString('pt-BR')}
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={createEvent} style={{display:'flex',gap:8}}>
            <input
              type="text"
              placeholder="Nome do evento"
              value={newName}
              onChange={(e)=>setNewName(e.target.value)}
              style={{flex:1,padding:6}}
            />
            <button type="submit">Criar</button>
          </form>
        </>
      )}
    </div>
  );
}
