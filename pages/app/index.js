import { useEffect, useState } from 'react';
import AuthGuard from '../../components/AuthGuard';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

export default function AppHome() {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState('');

  // Carrega eventos existentes
  const load = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setEvents(data || []);
  };

  useEffect(() => { load(); }, []);

  // Criar novo evento
  const createEvent = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const { data, error } = await supabase
      .from('events')
      .insert({ name })
      .select()
      .single();
    if (!error) {
      setName('');
      setEvents([data, ...events]);
    } else {
      alert('Erro ao criar evento: ' + error.message);
    }
  };

  return (
    <AuthGuard>
      <div className="grid gap-6">
        <div className="card">
          <h1 className="text-xl font-semibold">Eventos</h1>
          <form onSubmit={createEvent} className="mt-3 grid grid-cols-1 sm:grid-cols-5 gap-2">
            <input
              className="input sm:col-span-4"
              placeholder="Nome do evento (ex.: Casamento Marina & Caio)"
              value={name}
              onChange={e=>setName(e.target.value)}
            />
            <button className="btn">Criar</button>
          </form>
        </div>

        <div className="grid gap-3">
          {events.map(ev => (
            <div key={ev.id} className="card">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold flex-1">{ev.name}</h2>
                <Link className="btn" href={`/app/events/${ev.id}`}>Abrir</Link>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="text-sm text-gray-600">Nenhum evento ainda.</div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
