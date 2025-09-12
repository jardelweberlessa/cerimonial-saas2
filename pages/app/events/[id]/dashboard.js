import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import AuthGuard from '../../../../components/AuthGuard';
import { supabase } from '../../../../lib/supabaseClient';

const money = (n) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(Number(n || 0));

function todayYMD() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
function diffDays(fromYMD, toYMD) {
  if (!fromYMD || !toYMD) return null;
  const a = new Date(`${fromYMD}T00:00:00`);
  const b = new Date(`${toYMD}T00:00:00`);
  const ms = b - a;
  return Math.round(ms / 86400000);
}

export default function EventDashboard() {
  const router = useRouter();
  const { id } = router.query; // event_id

  const [event, setEvent] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [guests, setGuests] = useState([]);
  const [tx, setTx] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!id) return;
    setLoading(true);

    const evP = supabase.from('events').select('*').eq('id', id).single();
    const tasksP = supabase
      .from('tasks')
      .select('*')
      .eq('event_id', id)
      .order('due_date', { ascending: true });

    const guestsP = supabase
      .from('guests')
      .select('*')
      .eq('event_id', id);

    const txP = supabase
      .from('tx')
      .select('*')
      .eq('event_id', id);

    const [ev, t, g, x] = await Promise.all([evP, tasksP, guestsP, txP]);

    setEvent(ev.data || null);
    setTasks(t.data || []);
    setGuests(g.data || []);
    setTx(x.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  // === Checklist
  const checkTotals = useMemo(() => {
    const tot = tasks.length;
    const done = tasks.filter((i) => !!i.done).length;
    const pct = tot > 0 ? Math.round((done / tot) * 100) : 0;
    return { tot, done, pct };
  }, [tasks]);

  const nextDeadlines = useMemo(() => {
    const today = todayYMD();
    const pend = tasks
      .filter((t) => !t.done && t.due_date && t.due_date >= today)
      .sort((a, b) => String(a.due_date).localeCompare(String(b.due_date)))
      .slice(0, 3);
    return pend;
  }, [tasks]);

  // === RSVP
  const rsvp = useMemo(() => {
    const tot = guests.length;
    const conf = guests.filter((g) => g.rsvp === 'Confirmado').length;
    const pend = guests.filter((g) => g.rsvp === 'Pendente').length;
    const rec = guests.filter((g) => g.rsvp === 'Recusado').length;
    return { tot, conf, pend, rec };
  }, [guests]);

  // === Financeiro
  const finance = useMemo(() => {
    const prev = tx
      .filter((r) => r.kind === 'Previsto')
      .reduce((s, r) => s + (Number(r.value) || 0), 0);
    const real = tx
      .filter((r) => r.kind === 'Realizado')
      .reduce((s, r) => s + (Number(r.value) || 0), 0);
    return { prev, real, saldo: real - prev };
  }, [tx]);

  if (loading) {
    return (
      <AuthGuard>
        <div className="card">Carregando dashboard…</div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="grid gap-6">
        {/* Cabeçalho */}
        <div className="card">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-xl font-semibold">{event?.name || 'Evento'}</h1>
              <p className="text-sm text-gray-600">Visão geral do planejamento</p>
            </div>
            <div className="flex gap-2">
              <button className="btn" onClick={load}>Atualizar</button>
              <Link className="btn" href={`/app/events/${id}`}>Módulos</Link>
            </div>
          </div>
        </div>

        {/* Cards principais */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Checklist */}
          <div className="card">
            <div className="text-sm text-gray-600">Checklist</div>
            <div className="mt-1 text-2xl font-semibold">{checkTotals.pct}%</div>
            <div className="mt-2 h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-green-600 rounded"
                style={{ width: `${checkTotals.pct}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-gray-600">
              {checkTotals.done} de {checkTotals.tot} tarefas concluídas
            </div>
            <Link className="btn mt-3" href={`/app/events/${id}/checklist`}>Abrir Checklist</Link>
          </div>

          {/* Próximos prazos */}
          <div className="card">
            <div className="text-sm text-gray-600">Próximos prazos</div>
            {nextDeadlines.length === 0 ? (
              <div className="mt-2 text-sm text-gray-700">Sem prazos próximos.</div>
            ) : (
              <ul className="mt-2 text-sm">
                {nextDeadlines.map((t) => (
                  <li key={t.id} className="py-1 border-b last:border-none">
                    <div className="font-medium">{t.title || t.name || 'Tarefa'}</div>
                    <div className="text-gray-600">
                      {t.due_date} · {diffDays(todayYMD(), t.due_date)} dias
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link className="btn mt-3" href={`/app/events/${id}/checklist`}>Ver prazos</Link>
          </div>

          {/* RSVP */}
          <div className="card">
            <div className="text-sm text-gray-600">RSVP</div>
            <div className="mt-2 text-sm">
              Total: <b>{rsvp.tot}</b><br />
              Confirmados: <b>{rsvp.conf}</b><br />
              Pendentes: <b>{rsvp.pend}</b><br />
              Recusados: <b>{rsvp.rec}</b>
            </div>
            <Link className="btn mt-3" href={`/app/events/${id}/guests`}>Gerenciar convidados</Link>
          </div>

          {/* Financeiro */}
          <div className="card">
            <div className="text-sm text-gray-600">Financeiro</div>
            <div className="mt-2 text-sm">
              Previsto: <b>{money(finance.prev)}</b><br />
              Realizado: <b>{money(finance.real)}</b><br />
              Saldo: <b>{money(finance.saldo)}</b>
            </div>
            <Link className="btn mt-3" href={`/app/events/${id}/budget`}>Abrir orçamento</Link>
          </div>
        </div>

        {/* Atalhos */}
        <div className="card">
          <div className="text-sm text-gray-600 mb-2">Acessos rápidos</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            <Link className="btn" href={`/app/events/${id}/checklist`}>Checklist</Link>
            <Link className="btn" href={`/app/events/${id}/timeline`}>Cronograma (Dia D)</Link>
            <Link className="btn" href={`/app/events/${id}/guests`}>Convidados & RSVP</Link>
            <Link className="btn" href={`/app/events/${id}/suppliers`}>Fornecedores</Link>
            <Link className="btn" href={`/app/events/${id}/budget`}>Orçamento</Link>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
