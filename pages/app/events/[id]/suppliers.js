import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import AuthGuard from '../../../../components/AuthGuard';
import { supabase } from '../../../../lib/supabaseClient';
import Toast from '../../../../components/Toast';
import Badge from '../../../../components/Badge';
import SortHeader from '../../../../components/SortHeader';

const toNumber = (v) => {
  if (v === '' || v === null || v === undefined) return null;
  const x = parseFloat(String(v).replace(/\./g, '').replace(',', '.'));
  return isNaN(x) ? null : x;
};

export default function Suppliers() {
  const router = useRouter();
  const { id } = router.query; // event_id
  const [event, setEvent] = useState(null);
  const [items, setItems] = useState([]);

  // toasts
  const [toast, setToast] = useState(null);

  // ---- filtros
  const [q, setQ] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  // ---- ordenação
  const [sort, setSort] = useState({ key: 'name', dir: 'asc' });

  // ---- formulário de entrada
  const [form, setForm] = useState({
    name: '', category: '', contact: '', contract_url: '',
    planned: '', negotiated: '', status: 'Aberto', next_payment: ''
  });

  const load = async () => {
    if (!id) return;
    const ev = await supabase.from('events').select('*').eq('id', id).single();
    setEvent(ev.data || null);
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('event_id', id)
      .order('name', { ascending: true });
    if (!error) setItems(data || []);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  // ---- CRUD
  const add = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert('Informe o nome do fornecedor.');
    const payload = {
      event_id: id,
      name: form.name.trim(),
      category: form.category || null,
      contact: form.contact || null,
      contract_url: form.contract_url || null,
      planned: toNumber(form.planned),
      negotiated: toNumber(form.negotiated),
      status: form.status || 'Aberto',
      next_payment: form.next_payment || null,
    };
    const { data, error } = await supabase.from('suppliers').insert(payload).select().single();
    if (error) return setToast({ text: 'Erro ao adicionar: ' + error.message, type: 'error' });
    setForm({ name: '', category: '', contact: '', contract_url: '', planned: '', negotiated: '', status: 'Aberto', next_payment: '' });
    setItems([...(items || []), data]);
    setToast({ text: 'Fornecedor adicionado!' });
  };

  const update = async (row, fields) => {
    const { data, error } = await supabase.from('suppliers').update(fields).eq('id', row.id).select().single();
    if (error) return setToast({ text: 'Erro ao atualizar: ' + error.message, type: 'error' });
    setItems(items.map(i => i.id === row.id ? data : i));
    setToast({ text: 'Alterado com sucesso!' });
  };

  const del = async (row) => {
    const ok = confirm(`Excluir fornecedor "${row.name}"?`);
    if (!ok) return;
    const { error } = await supabase.from('suppliers').delete().eq('id', row.id);
    if (error) return setToast({ text: 'Erro ao excluir: ' + error.message, type: 'error' });
    setItems(items.filter(i => i.id !== row.id));
    setToast({ text: 'Excluído!' });
  };

  // ---- filtros e ordenação
  const filtered = useMemo(() => {
    const v = (q || '').toLowerCase();
    let arr = (items || []).filter(s => {
      const textMatch =
        [s.name, s.category, s.contact, s.status]
          .some(x => (x || '').toLowerCase().includes(v));
      if (!textMatch) return false;
      if (catFilter && !(s.category || '').toLowerCase().includes(catFilter.toLowerCase())) return false;
      if (statusFilter !== 'Todos' && s.status !== statusFilter) return false;
      return true;
    });

    // ordenar
    const key = sort.key;
    const dir = sort.dir === 'asc' ? 1 : -1;
    arr = arr.sort((a, b) => {
      const av = a[key] ?? '';
      const bv = b[key] ?? '';
      return String(av).localeCompare(String(bv)) * dir;
    });

    return arr;
  }, [items, q, catFilter, statusFilter, sort]);

  // ---- CSV
  const exportCsv = () => {
    const header = ['name', 'category', 'contact', 'contract_url', 'planned', 'negotiated', 'status', 'next_payment'];
    const rows = filtered.map(s => header.map(h => s[h] ?? '').join(','));
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `fornecedores_${event?.name || 'evento'}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const importCsv = async (file) => {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length <= 1) return alert('CSV vazio.');
    const header = lines[0].split(',').map(s => s.trim().toLowerCase());
    const idx = (n) => header.findIndex(h => h === n);
    const parse = (cols) => ({
      event_id: id,
      name: cols[idx('name')] || '',
      category: cols[idx('category')] || null,
      contact: cols[idx('contact')] || null,
      contract_url: cols[idx('contract_url')] || null,
      planned: toNumber(cols[idx('planned')]),
      negotiated: toNumber(cols[idx('negotiated')]),
      status: cols[idx('status')] || 'Aberto',
      next_payment: cols[idx('next_payment')] || null,
    });
    const payload = lines.slice(1).map(l => parse(l.split(',')));
    const chunk = 200;
    for (let i = 0; i < payload.length; i += chunk) {
      const slice = payload.slice(i, i + chunk);
      const { error } = await supabase.from('suppliers').insert(slice);
      if (error) return setToast({ text: 'Erro ao importar: ' + error.message, type: 'error' });
    }
    await load();
    setToast({ text: 'Importação concluída!' });
  };

  // ---- WhatsApp link
  const openWhats = (rawPhone, text) => {
    if (!rawPhone) return alert('Contato sem telefone.');
    const digits = ('' + rawPhone).replace(/\D/g, '');
    const phone = digits.startsWith('55') || digits.startsWith('+') ? digits : '55' + digits;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };
  const msgFornecedor = (s) =>
    `Olá ${s.name}! Estamos organizando o evento "${event?.name}".` +
    (s.next_payment ? `\nPróximo pagamento: ${s.next_payment}` : '') +
    (s.negotiated ? `\nValor negociado: R$ ${s.negotiated}` : '') +
    `\n\n(Enviado via plataforma do cerimonial)`;

  const badgeForStatus = (st) => {
    if (st === 'Pago') return <Badge tone="success">Pago</Badge>;
    if (st === 'Fechado') return <Badge tone="violet">Fechado</Badge>;
    if (st === 'Cancelado') return <Badge tone="gray">Cancelado</Badge>;
    return <Badge tone="info">Aberto</Badge>;
  };

  return (
    <AuthGuard>
      <div className="grid gap-6">
        <div className="card">
          <h1 className="text-xl font-semibold">Fornecedores</h1>

          {/* FILTROS com cabeçalho */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="py-2 px-2">Buscar (nome/categoria/status/contato)</th>
                  <th className="py-2 px-2">Filtrar por Categoria</th>
                  <th className="py-2 px-2">Status</th>
                  <th className="py-2 px-2">CSV</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-2">
                    <input className="input" placeholder="ex.: buffet, DJ, pago..."
                      value={q} onChange={e => setQ(e.target.value)} />
                  </td>
                  <td className="py-2 px-2">
                    <input className="input" placeholder="ex.: fotografia"
                      value={catFilter} onChange={e => setCatFilter(e.target.value)} />
                  </td>
                  <td className="py-2 px-2">
                    <select className="select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                      <option>Todos</option>
                      <option>Aberto</option>
                      <option>Fechado</option>
                      <option>Pago</option>
                      <option>Cancelado</option>
                    </select>
                  </td>
                  <td className="py-2 px-2">
                    <div className="flex gap-2">
                      <button className="btn" onClick={exportCsv}>Exportar</button>
                      <label className="btn cursor-pointer">
                        Importar
                        <input type="file" accept=".csv" className="hidden"
                          onChange={e => e.target.files?.[0] && importCsv(e.target.files[0])} />
                      </label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* LINHA DE CADASTRO com cabeçalho */}
          <form onSubmit={add} className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="py-2 px-2">Nome</th>
                    <th className="py-2 px-2">Categoria</th>
                    <th className="py-2 px-2">Contato (WhatsApp)</th>
                    <th className="py-2 px-2">Contrato (URL)</th>
                    <th className="py-2 px-2">Previsto</th>
                    <th className="py-2 px-2">Negociado</th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 px-2">Próx. Pagto</th>
                    <th className="py-2 px-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-2"><input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Buffet, DJ..." /></td>
                    <td className="py-2 px-2"><input className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Categoria" /></td>
                    <td className="py-2 px-2"><input className="input" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="(DDD) 9xxxx-xxxx" /></td>
                    <td className="py-2 px-2"><input className="input" value={form.contract_url} onChange={e => setForm({ ...form, contract_url: e.target.value })} placeholder="https://..." /></td>
                    <td className="py-2 px-2"><input className="input" value={form.planned} onChange={e => setForm({ ...form, planned: e.target.value })} placeholder="0,00" /></td>
                    <td className="py-2 px-2"><input className="input" value={form.negotiated} onChange={e => setForm({ ...form, negotiated: e.target.value })} placeholder="0,00" /></td>
                    <td className="py-2 px-2">
                      <select className="select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                        <option>Aberto</option>
                        <option>Fechado</option>
                        <option>Pago</option>
                        <option>Cancelado</option>
                      </select>
                    </td>
                    <td className="py-2 px-2"><input className="input" type="date" value={form.next_payment} onChange={e => setForm({ ...form, next_payment: e.target.value })} /></td>
                    <td className="py-2 px-2"><button className="btn">Adicionar</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </form>
        </div>

        {/* LISTAGEM / EDIÇÃO */}
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <SortHeader label="Nome" column="name" sort={sort} setSort={setSort} />
                <SortHeader label="Categoria" column="category" sort={sort} setSort={setSort} />
                <th className="py-2 px-2">Contato</th>
                <th className="py-2 px-2">Contrato</th>
                <SortHeader label="Previsto" column="planned" sort={sort} setSort={setSort} />
                <SortHeader label="Negociado" column="negotiated" sort={sort} setSort={setSort} />
                <SortHeader label="Status" column="status" sort={sort} setSort={setSort} />
                <SortHeader label="Próx. Pagto" column="next_payment" sort={sort} setSort={setSort} />
                <th className="py-2 px-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id} className="border-b last:border-none">
                  <td className="py-2 px-2 font-medium">
                    <input className="input" value={row.name || ''} onChange={e => update(row, { name: e.target.value })} />
                  </td>
                  <td className="py-2 px-2">
                    <input className="input" value={row.category || ''} onChange={e => update(row, { category: e.target.value })} />
                  </td>
                  <td className="py-2 px-2">{row.contact || '—'}</td>
                  <td className="py-2 px-2">
                    {row.contract_url ? <a className="text-blue-600 underline" href={row.contract_url} target="_blank" rel="noreferrer">Abrir</a> : '—'}
                  </td>
                  <td className="py-2 px-2">
                    <input className="input" value={row.planned ?? ''} onChange={e => update(row, { planned: toNumber(e.target.value) })} />
                  </td>
                  <td className="py-2 px-2">
                    <input className="input" value={row.negotiated ?? ''} onChange={e => update(row, { negotiated: toNumber(e.target.value) })} />
                  </td>
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <select className="select" value={row.status || 'Aberto'} onChange={e => update(row, { status: e.target.value })}>
                        <option>Aberto</option><option>Fechado</option><option>Pago</option><option>Cancelado</option>
                      </select>
                      {badgeForStatus(row.status)}
                    </div>
                  </td>
                  <td className="py-2 px-2">
                    <input className="input" type="date" value={row.next_payment || ''} onChange={e => update(row, { next_payment: e.target.value || null })} />
                  </td>
                  <td className="py-2 px-2 flex gap-3">
                    <button className="text-red-600" onClick={() => del(row)}>Excluir</button>
                    {row.contact && (
                      <button className="text-green-700" onClick={() => openWhats(row.contact, msgFornecedor(row))}>
                        WhatsApp
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="9" className="py-6 text-center text-gray-600">
                    Nenhum fornecedor encontrado. Que tal cadastrar o primeiro? 🎯
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {toast && <Toast {...toast} onDone={() => setToast(null)} />}
      </div>
    </AuthGuard>
  );
}
