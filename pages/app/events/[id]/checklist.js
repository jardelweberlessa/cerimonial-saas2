import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import AuthGuard from '../../../../components/AuthGuard';
import { supabase } from '../../../../lib/supabaseClient';
import Toast from '../../../../components/Toast';
import Badge from '../../../../components/Badge';
import SortHeader from '../../../../components/SortHeader';

const todayYMD = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

export default function Checklist() {
  const router = useRouter();
  const { id } = router.query; // event_id

  const [event, setEvent] = useState(null);
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState(null);

  // filtros
  const [q, setQ] = useState('');
  const [prio, setPrio] = useState('Todas');
  const [status, setStatus] = useState('Todas'); // Concluída / Pendente

  // ordenação
  const [sort, setSort] = useState({ key: 'due_date', dir: 'asc' });

  // formulário
  const [form, setForm] = useState({
    title:'', owner:'', priority:'Média', due_date:'', note:'', done:false
  });

  const load = async () => {
    if (!id) return;
    const ev = await supabase.from('events').select('*').eq('id', id).single();
    setEvent(ev.data || null);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('event_id', id)
      .order('due_date', { ascending: true });
    if (!error) setItems(data || []);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  // CRUD
  const add = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert('Informe o título da tarefa.');
    const payload = {
      event_id: id,
      title: form.title.trim(),
      owner: form.owner || null,
      priority: form.priority || 'Média',
      due_date: form.due_date || null,
      note: form.note || null,
      done: !!form.done,
    };
    const { data, error } = await supabase.from('tasks').insert(payload).select().single();
    if (error) return setToast({ text:'Erro ao adicionar: '+error.message, type:'error' });
    setItems([...(items||[]), data]);
    setForm({ title:'', owner:'', priority:'Média', due_date:'', note:'', done:false });
    setToast({ text:'Tarefa adicionada!' });
  };

  const update = async (row, fields) => {
    const { data, error } = await supabase.from('tasks').update(fields).eq('id', row.id).select().single();
    if (error) return setToast({ text:'Erro ao atualizar: '+error.message, type:'error' });
    setItems(items.map(i => i.id === row.id ? data : i));
    setToast({ text:'Alterado com sucesso!' });
  };

  const del = async (row) => {
    const ok = confirm(`Excluir tarefa "${row.title || row.name}"?`);
    if (!ok) return;
    const { error } = await supabase.from('tasks').delete().eq('id', row.id);
    if (error) return setToast({ text:'Erro ao excluir: '+error.message, type:'error' });
    setItems(items.filter(i => i.id !== row.id));
    setToast({ text:'Excluída!' });
  };

  // filtros + ordenar
  const filtered = useMemo(() => {
    let arr = (items || []).filter(t => {
      const text = [t.title, t.owner, t.priority, t.note].join(' ').toLowerCase();
      if (q && !text.includes(q.toLowerCase())) return false;
      if (prio !== 'Todas' && (t.priority || 'Média') !== prio) return false;
      if (status !== 'Todas') {
        const done = !!t.done;
        if (status === 'Concluída' && !done) return false;
        if (status === 'Pendente' && done) return false;
      }
      return true;
    });

    const dir = sort.dir === 'asc' ? 1 : -1;
    arr = arr.sort((a,b) => String(a[sort.key] ?? '').localeCompare(String(b[sort.key] ?? '')) * dir);
    return arr;
  }, [items, q, prio, status, sort]);

  // badges
  const badgePriority = (p) => {
    if (p === 'Alta') return <Badge tone="danger">Alta</Badge>;
    if (p === 'Média') return <Badge tone="warn">Média</Badge>;
    return <Badge tone="gray">Baixa</Badge>;
  };

  // CSV
  const exportCsv = () => {
    const header = ['title','owner','priority','due_date','done','note'];
    const rows = filtered.map(r => header.map(h => (r[h] ?? '')).join(','));
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `checklist_${event?.name || 'evento'}.csv`; a.click();
    URL.revokeObjectURL(url);
  };
  const importCsv = async (file) => {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length <= 1) return alert('CSV vazio.');
    const header = lines[0].split(',').map(s=>s.trim().toLowerCase());
    const idx = (n) => header.findIndex(h => h === n);
    const parse = (cols) => ({
      event_id: id,
      title: cols[idx('title')] || '',
      owner: cols[idx('owner')] || null,
      priority: cols[idx('priority')] || 'Média',
      due_date: cols[idx('due_date')] || null,
      done: String(cols[idx('done')]).toLowerCase() === 'true',
      note: cols[idx('note')] || null,
    });
    const payload = lines.slice(1).map(l => parse(l.split(',')));
    const chunk = 300;
    for (let i=0; i<payload.length; i+=chunk) {
      const slice = payload.slice(i,i+chunk);
      const { error } = await supabase.from('tasks').insert(slice);
      if (error) return setToast({ text:'Erro ao importar: '+error.message, type:'error' });
    }
    await load();
    setToast({ text:'Importação concluída!' });
  };

  // ajuda visual: vencidas
  const isOverdue = (row) => {
    if (row.done) return false;
    if (!row.due_date) return false;
    return row.due_date < todayYMD();
  };

  return (
    <AuthGuard>
      <div className="grid gap-6">
        <div className="card">
          <h1 className="text-xl font-semibold">Checklist</h1>

          {/* filtros com cabeçalho */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="py-2 px-2">Buscar</th>
                  <th className="py-2 px-2">Prioridade</th>
                  <th className="py-2 px-2">Status</th>
                  <th className="py-2 px-2">CSV</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-2"><input className="input" placeholder="título, responsável, obs..." value={q} onChange={e=>setQ(e.target.value)} /></td>
                  <td className="py-2 px-2">
                    <select className="select" value={prio} onChange={e=>setPrio(e.target.value)}>
                      <option>Todas</option><option>Alta</option><option>Média</option><option>Baixa</option>
                    </select>
                  </td>
                  <td className="py-2 px-2">
                    <select className="select" value={status} onChange={e=>setStatus(e.target.value)}>
                      <option>Todas</option><option>Concluída</option><option>Pendente</option>
                    </select>
                  </td>
                  <td className="py-2 px-2">
                    <div className="flex gap-2">
                      <button className="btn" onClick={exportCsv}>Exportar</button>
                      <label className="btn cursor-pointer">
                        Importar
                        <input type="file" accept=".csv" className="hidden" onChange={e=>e.target.files?.[0] && importCsv(e.target.files[0])} />
                      </label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* linha de cadastro */}
          <form onSubmit={add} className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="py-2 px-2">Título</th>
                    <th className="py-2 px-2">Responsável</th>
                    <th className="py-2 px-2">Prioridade</th>
                    <th className="py-2 px-2">Prazo</th>
                    <th className="py-2 px-2">Obs.</th>
                    <th className="py-2 px-2">Concluir?</th>
                    <th className="py-2 px-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-2"><input className="input" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} placeholder="Ex.: Fechar buffet" /></td>
                    <td className="py-2 px-2"><input className="input" value={form.owner} onChange={e=>setForm({...form, owner:e.target.value})} placeholder="Quem faz" /></td>
                    <td className="py-2 px-2">
                      <select className="select" value={form.priority} onChange={e=>setForm({...form, priority:e.target.value})}>
                        <option>Alta</option><option>Média</option><option>Baixa</option>
                      </select>
                    </td>
                    <td className="py-2 px-2"><input className="input" type="date" value={form.due_date} onChange={e=>setForm({...form, due_date:e.target.value})} /></td>
                    <td className="py-2 px-2"><input className="input" value={form.note} onChange={e=>setForm({...form, note:e.target.value})} placeholder="Observações" /></td>
                    <td className="py-2 px-2">
                      <input type="checkbox" checked={!!form.done} onChange={e=>setForm({...form, done:e.target.checked})} />
                    </td>
                    <td className="py-2 px-2"><button className="btn">Adicionar</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </form>
        </div>

        {/* listagem / edição */}
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <SortHeader label="Título" column="title" sort={sort} setSort={setSort} />
                <SortHeader label="Responsável" column="owner" sort={sort} setSort={setSort} />
                <SortHeader label="Prioridade" column="priority" sort={sort} setSort={setSort} />
                <SortHeader label="Prazo" column="due_date" sort={sort} setSort={setSort} />
                <th className="py-2 px-2">Obs.</th>
                <SortHeader label="Status" column="done" sort={sort} setSort={setSort} />
                <th className="py-2 px-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id} className={`border-b last:border-none ${isOverdue(row) ? 'bg-red-50' : ''}`}>
                  <td className="py-2 px-2 font-medium">
                    <input className="input" value={row.title || row.name || ''} onChange={e=>update(row, { title:e.target.value })} />
                  </td>
                  <td className="py-2 px-2"><input className="input" value={row.owner || ''} onChange={e=>update(row, { owner:e.target.value })} /></td>
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <select className="select" value={row.priority || 'Média'} onChange={e=>update(row, { priority:e.target.value })}>
                        <option>Alta</option><option>Média</option><option>Baixa</option>
                      </select>
                      {badgePriority(row.priority || 'Média')}
                    </div>
                  </td>
                  <td className="py-2 px-2"><input className="input" type="date" value={row.due_date || ''} onChange={e=>update(row, { due_date:e.target.value || null })} /></td>
                  <td className="py-2 px-2"><input className="input" value={row.note || ''} onChange={e=>update(row, { note:e.target.value || null })} /></td>
                  <td className="py-2 px-2">
                    <input type="checkbox" checked={!!row.done} onChange={e=>update(row, { done:e.target.checked })} />
                    <span className="ml-2 text-xs text-gray-600">{row.done ? 'Concluída' : 'Pendente'}</span>
                  </td>
                  <td className="py-2 px-2">
                    <button className="text-red-600" onClick={()=>del(row)}>Excluir</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-gray-600">
                    Nada por aqui. Comece criando a primeira tarefa ou importando um CSV 🧭
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {toast && <Toast {...toast} onDone={()=>setToast(null)} />}
      </div>
    </AuthGuard>
  );
}
