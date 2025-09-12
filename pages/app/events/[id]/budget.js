import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import AuthGuard from '../../../../components/AuthGuard';
import { supabase } from '../../../../lib/supabaseClient';
import Toast from '../../../../components/Toast';
import SortHeader from '../../../../components/SortHeader';

const toNumber = (v) => {
  if (v === '' || v === null || v === undefined) return null;
  const x = parseFloat(String(v).replace(/\./g, '').replace(',', '.'));
  return isNaN(x) ? null : x;
};
const money = (n) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(Number(n || 0));

export default function Budget() {
  const router = useRouter();
  const { id } = router.query; // event_id

  const [event, setEvent] = useState(null);
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState(null);

  // ---- filtros
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [cat, setCat] = useState('');
  const [kind, setKind] = useState('Todos');
  const [paid, setPaid] = useState('Todos');

  // ---- ordenação
  const [sort, setSort] = useState({ key: 'date', dir: 'asc' });

  // ---- formulário de entrada
  const [form, setForm] = useState({
    date: '', category: '', supplier: '', kind: 'Previsto',
    value: '', paid: false, note: ''
  });

  const load = async () => {
    if (!id) return;
    const ev = await supabase.from('events').select('*').eq('id', id).single();
    setEvent(ev.data || null);
    const { data, error } = await supabase
      .from('tx')
      .select('*')
      .eq('event_id', id)
      .order('date', { ascending: true });
    if (!error) setItems(data || []);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  // ---- CRUD
  const add = async (e) => {
    e.preventDefault();
    if (!form.category.trim()) return alert('Informe a categoria.');
    const payload = {
      event_id: id,
      date: form.date || null,
      category: form.category.trim(),
      supplier: form.supplier || null,
      kind: form.kind,
      value: toNumber(form.value),
      paid: !!form.paid,
      note: form.note || null,
    };
    const { data, error } = await supabase.from('tx').insert(payload).select().single();
    if (error) return setToast({ text: 'Erro ao adicionar: ' + error.message, type: 'error' });
    setForm({ date: '', category: '', supplier: '', kind: 'Previsto', value: '', paid: false, note: '' });
    setItems([...(items || []), data]);
    setToast({ text: 'Lançamento adicionado!' });
  };

  const update = async (row, fields) => {
    const { data, error } = await supabase.from('tx').update(fields).eq('id', row.id).select().single();
    if (error) return setToast({ text: 'Erro ao atualizar: ' + error.message, type: 'error' });
    setItems(items.map(i => i.id === row.id ? data : i));
    setToast({ text: 'Alterado com sucesso!' });
  };

  const del = async (row) => {
    const ok = confirm(`Excluir lançamento de "${row.category}"?`);
    if (!ok) return;
    const { error } = await supabase.from('tx').delete().eq('id', row.id);
    if (error) return setToast({ text: 'Erro ao excluir: ' + error.message, type: 'error' });
    setItems(items.filter(i => i.id !== row.id));
    setToast({ text: 'Excluído!' });
  };

  // ---- aplicar filtros + ordenação
  const filtered = useMemo(() => {
    let arr = (items || []).filter(r => {
      if (dateFrom && (r.date || '') < dateFrom) return false;
      if (dateTo && (r.date || '') > dateTo) return false;
      if (cat && !(r.category || '').toLowerCase().includes(cat.toLowerCase())) return false;
      if (kind !== 'Todos' && r.kind !== kind) return false;
      if (paid === 'Sim' && !r.paid) return false;
      if (paid === 'Não' && !!r.paid) return false;
      return true;
    });

    // ordenar
    const key = sort.key;
    const dir = sort.dir === 'asc' ? 1 : -1;
    arr = arr.sort((a, b) => {
      const av = a[key] ?? '';
      const bv = b[key] ?? '';
      // números viram números, datas comparam string AAAA-MM-DD bem
      const na = typeof av === 'number' ? av : (isNaN(Number(av)) ? av : Number(av));
      const nb = typeof bv === 'number' ? bv : (isNaN(Number(bv)) ? bv : Number(bv));
      if (typeof na === 'number' && typeof nb === 'number') return (na - nb) * dir;
      return String(na).localeCompare(String(nb)) * dir;
    });

    return arr;
  }, [items, dateFrom, dateTo, cat, kind, paid, sort]);

  // ---- totais
  const totals = useMemo(() => {
    const prev = filtered.filter(i => i.kind === 'Previsto').reduce((s, i) => s + (Number(i.value) || 0), 0);
    const real = filtered.filter(i => i.kind === 'Realizado').reduce((s, i) => s + (Number(i.value) || 0), 0);
    return { prev, real, saldo: real - prev };
  }, [filtered]);

  // ---- CSV
  const exportCsv = () => {
    const header = ['date', 'category', 'supplier', 'kind', 'value', 'paid', 'note'];
    const rows = filtered.map(r => header.map(h => (r[h] ?? '')).join(','));
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `orcamento_${event?.name || 'evento'}.csv`; a.click();
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
      date: cols[idx('date')] || null,
      category: cols[idx('category')] || '',
      supplier: cols[idx('supplier')] || null,
      kind: (cols[idx('kind')] === 'Realizado') ? 'Realizado' : 'Previsto',
      value: toNumber(cols[idx('value')]),
      paid: String(cols[idx('paid')]).toLowerCase() === 'true',
      note: cols[idx('note')] || null,
    });
    const payload = lines.slice(1).map(l => parse(l.split(',')));
    const chunk = 300;
    for (let i = 0; i < payload.length; i += chunk) {
      const slice = payload.slice(i, i + chunk);
      const { error } = await supabase.from('tx').insert(slice);
      if (error) return setToast({ text: 'Erro ao importar: ' + error.message, type: 'error' });
    }
    await load();
    setToast({ text: 'Importação concluída!' });
  };

  return (
    <AuthGuard>
      <div className="grid gap-6">
        {/* RESUMO */}
        <div className="card">
          <h1 className="text-xl font-semibold">Orçamento</h1>
          <div className="mt-2 text-sm text-gray-700">
            Previsto: <b>{money(totals.prev)}</b> • Realizado: <b>{money(totals.real)}</b> • Saldo: <b>{money(totals.saldo)}</b>
          </div>

          {/* FILTROS com cabeçalho */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="py-2 px-2">De</th>
                  <th className="py-2 px-2">Até</th>
                  <th className="py-2 px-2">Categoria</th>
                  <th className="py-2 px-2">Tipo</th>
                  <th className="py-2 px-2">Pago?</th>
                  <th className="py-2 px-2">CSV</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-2">
                    <input className="input" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                  </td>
                  <td className="py-2 px-2">
                    <input className="input" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
                  </td>
                  <td className="py-2 px-2">
                    <input className="input" placeholder="Ex.: Buffet" value={cat} onChange={e => setCat(e.target.value)} />
                  </td>
                  <td className="py-2 px-2">
                    <select className="select" value={kind} onChange={e => setKind(e.target.value)}>
                      <option>Todos</option><option>Previsto</option><option>Realizado</option>
                    </select>
                  </td>
                  <td className="py-2 px-2">
                    <select className="select" value={paid} onChange={e => setPaid(e.target.value)}>
                      <option>Todos</option><option>Sim</option><option>Não</option>
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
                    <th className="py-2 px-2">Data</th>
                    <th className="py-2 px-2">Categoria</th>
                    <th className="py-2 px-2">Fornecedor</th>
                    <th className="py-2 px-2">Tipo</th>
                    <th className="py-2 px-2">Valor</th>
                    <th className="py-2 px-2">Pago?</th>
                    <th className="py-2 px-2">Obs.</th>
                    <th className="py-2 px-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-2"><input className="input" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></td>
                    <td className="py-2 px-2"><input className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Ex.: Buffet" /></td>
                    <td className="py-2 px-2"><input className="input" value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} placeholder="Nome do fornecedor" /></td>
                    <td className="py-2 px-2">
                      <select className="select" value={form.kind} onChange={e => setForm({ ...form, kind: e.target.value })}>
                        <option>Previsto</option><option>Realizado</option>
                      </select>
                    </td>
                    <td className="py-2 px-2"><input className="input" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="0,00" /></td>
                    <td className="py-2 px-2">
                      <input type="checkbox" checked={!!form.paid} onChange={e => setForm({ ...form, paid: e.target.checked })} />
                    </td>
                    <td className="py-2 px-2"><input className="input" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="Observações" /></td>
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
                <SortHeader label="Data" column="date" sort={sort} setSort={setSort} />
                <SortHeader label="Categoria" column="category" sort={sort} setSort={setSort} />
                <SortHeader label="Fornecedor" column="supplier" sort={sort} setSort={setSort} />
                <SortHeader label="Tipo" column="kind" sort={sort} setSort={setSort} />
                <SortHeader label="Valor" column="value" sort={sort} setSort={setSort} />
                <SortHeader label="Pago?" column="paid" sort={sort} setSort={setSort} />
                <th className="py-2 px-2">Obs.</th>
                <th className="py-2 px-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id} className="border-b last:border-none">
                  <td className="py-2 px-2"><input className="input" type="date" value={row.date || ''} onChange={e => update(row, { date: e.target.value || null })} /></td>
                  <td className="py-2 px-2"><input className="input" value={row.category || ''} onChange={e => update(row, { category: e.target.value })} /></td>
                  <td className="py-2 px-2"><input className="input" value={row.supplier || ''} onChange={e => update(row, { supplier: e.target.value })} /></td>
                  <td className="py-2 px-2">
                    <select className="select" value={row.kind || 'Previsto'} onChange={e => update(row, { kind: e.target.value })}>
                      <option>Previsto</option><option>Realizado</option>
                    </select>
                  </td>
                  <td className="py-2 px-2"><input className="input" value={row.value ?? ''} onChange={e => update(row, { value: toNumber(e.target.value) })} /></td>
                  <td className="py-2 px-2">
                    <input type="checkbox" checked={!!row.paid} onChange={e => update(row, { paid: e.target.checked })} />
                  </td>
                  <td className="py-2 px-2"><input className="input" value={row.note || ''} onChange={e => update(row, { note: e.target.value || null })} /></td>
                  <td className="py-2 px-2">
                    <button className="text-red-600" onClick={() => del(row)}>Excluir</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-6 text-center text-gray-600">
                    Nenhum lançamento com esse filtro. Tente limpar os filtros acima 🔍
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
