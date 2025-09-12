// pages/app/events/index.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';
import AuthGuard from '../../../components/AuthGuard';

export default function EventsIndex() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [me, setMe] = useState(null);
  const [form, setForm] = useState({
    name: '',
    event_date: '',
    venue: ''
  });
  const [msg, setMsg] = useState(null);

  const load = async () => {
    setLoading(true);
    // Com RLS ativo, o select já retorna só o que o usuário pode ver
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) setMsg('Erro ao carregar eventos: ' + error.message);
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    const boot = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setMe(user?.email || null);
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
      // owner_email precisa ser o seu e-mail para passar na policy do Supabase
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

      // Opcional: adicionar você como membro 'owner' (útil para políticas futuras)
      if (created?.id) {
        await supabase.from('event_members').insert({
          event_id: created.id,
          member_email: ownerEmail,
          role: 'owner'
        });
      }

      // limpa form e recarrega
      setForm({ name: '', event_date: '', venue: '' });
      await load();
      setMsg('Evento criado!');
    } catch (err) {
      setMsg('Erro ao criar evento: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <AuthGuard>
      <div className="grid gap-6">
        {/* Cabeçalho */}
        <div className="card">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-xl font-semibold">Eventos</h1>
              <p className="text-sm text-gray-600">
                Logado como: <b>{me || '—'}</b>
              </p>
            </div>
            <Link className="btn" href="/app">Ir para o App</Link>
          </div>
        </div>

        {/* Criar evento */}
        <div className="card">
          <h2 className="text-sm text-gray-600 mb-2">Criar novo evento</h2>
          <form onSubmit={onCreate} className="grid gap-3 md:grid-cols-4">
            <div className="md:col-span-2">
              <label className="label">Nome do evento</label>
              <input
                className="input"
                placeholder="Ex.: Casamento Marina & Caio"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Data (opcional)</label>
              <input
                className="input"
                type="date"
                value={form.event_date}
                onChange={e => setForm({ ...form, event_date: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Local (opcional)</label>
              <input
                className="input"
                placeholder="Salão, igreja, cidade…"
                value={form.venue}
                onChange={e => setForm({ ...form, venue: e.target.value })}
              />
            </div>
            <div className="md:col-span-4">
              <button className="btn" disabled={sending}>{sending ? 'Criando…' : 'Criar evento'}</button>
            </div>
          </form>

          {msg && <div className="mt-3 text-sm">{msg}</div>}
          <div className="mt-2 text-xs text-gray-600">
            Dica: se aparecer erro de permissão ao criar, podemos ligar o “modo testes” nas policies
            ou ajustar seu plano/trial em <code>/app/admin/billing</code>.
          </div>
        </div>

        {/* Lista */}
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-2 px-2">Nome</th>
                <th className="py-2 px-2">Data</th>
                <th className="py-2 px-2">Local</th>
                <th className="py-2 px-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="4" className="py-6 text-center text-gray-600">Carregando…</td></tr>
              )}
              {!loading && items.length === 0 && (
                <tr><td colSpan="4" className="py-6 text-center text-gray-600">Nenhum evento. Crie o primeiro acima ✨</td></tr>
              )}
              {!loading && items.map(ev => (
                <tr key={ev.id} className="border-b last:border-none">
                  <td className="py-2 px-2">{ev.name}</td>
                  <td className="py-2 px-2">{ev.event_date || '—'}</td>
                  <td className="py-2 px-2">{ev.venue || '—'}</td>
                  <td className="py-2 px-2">
                    <Link className="btn" href={`/app/events/${ev.id}`}>Abrir módulos</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </AuthGuard>
  );
}
