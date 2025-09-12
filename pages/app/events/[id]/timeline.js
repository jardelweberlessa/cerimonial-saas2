import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AuthGuard from '../../../../components/AuthGuard';
import { supabase } from '../../../../lib/supabaseClient';

const ROLE_LABEL = {
  noivos: 'Noivos',
  assessoria: 'Assessoria',
  cerimonial: 'Cerimonial',
};

export default function Timeline() {
  const router = useRouter();
  const { id } = router.query; // event_id
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ time: '', label: '', actor_role: 'cerimonial', note: '' });

  const load = async () => {
    const { data, error } = await supabase
      .from('timeline_items')
      .select('*')
      .eq('event_id', id)
      .order('time', { ascending: true });
    if (!error) setItems(data || []);
  };

  useEffect(() => { if (id) load(); }, [id]);

  const validHour = (str) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(str || '');

  const add = async (e) => {
    e.preventDefault();
    if (!form.label.trim()) return alert('Informe a Etapa.');
    if (!validHour(form.time)) return alert('Hora inválida. Use HH:MM (ex.: 15:30).');

    const payload = { ...form, event_id: id };
    const { data, error } = await supabase.from('timeline_items').insert(payload).select().single();
    if (error) return alert('Erro ao adicionar: ' + error.message);

    setItems([...(items || []), data].sort((a, b) => String(a.time).localeCompare(String(b.time))));
    setForm({ time: '', label: '', actor_role: 'cerimonial', note: '' });
  };

  const toggle = async (row) => {
    const { data, error } = await supabase
      .from('timeline_items')
      .update({ done: !row.done })
      .eq('id', row.id)
      .select()
      .single();
    if (!error) setItems(items.map((i) => (i.id === row.id ? data : i)));
  };

  const del = async (row) => {
    await supabase.from('timeline_items').delete().eq('id', row.id);
    setItems(items.filter((i) => i.id !== row.id));
  };

  return (
    <AuthGuard>
      <div className="grid gap-6">
        <div className="card">
          <h1 className="text-xl font-semibold">Cronograma (Dia D)</h1>

          {/* Tabela de entrada com cabeçalho */}
          <form onSubmit={add} className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="py-2 px-2">Hora (HH:MM)</th>
                    <th className="py-2 px-2">Etapa</th>
                    <th className="py-2 px-2">Responsável</th>
                    <th className="py-2 px-2">Notas</th>
                    <th className="py-2 px-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b last:border-none">
                    <td className="py-2 px-2">
                      <input className="input" placeholder="15:30"
                        value={form.time}
                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input className="input" placeholder="Entrada da noiva, cortejo..."
                        value={form.label}
                        onChange={(e) => setForm({ ...form, label: e.target.value })}
                      />
                    </td>
                    <td className="py-2 px-2">
                      <select className="select" value={form.actor_role}
                        onChange={(e) => setForm({ ...form, actor_role: e.target.value })}
                      >
                        <option value="cerimonial">Cerimonial</option>
                        <option value="assessoria">Assessoria</option>
                        <option value="noivos">Noivos</option>
                      </select>
                    </td>
                    <td className="py-2 px-2">
                      <input className="input" placeholder="Ex.: alinhar com fotógrafo"
                        value={form.note}
                        onChange={(e) => setForm({ ...form, note: e.target.value })}
                      />
                    </td>
                    <td className="py-2 px-2">
                      <button className="btn">Adicionar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </form>
        </div>

        {/* Tabela de listagem */}
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-2 px-2">Concluído</th>
                <th className="py-2 px-2">Hora</th>
                <th className="py-2 px-2">Etapa</th>
                <th className="py-2 px-2">Responsável</th>
                <th className="py-2 px-2">Notas</th>
                <th className="py-2 px-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id} className="border-b last:border-none">
                  <td className="py-2 px-2">
                    <input type="checkbox" checked={!!row.done} onChange={() => toggle(row)} />
                  </td>
                  <td className="py-2 px-2">{row.time || '—'}</td>
                  <td className="py-2 px-2">{row.label}</td>
                  <td className="py-2 px-2">{ROLE_LABEL[row.actor_role] || row.actor_role}</td>
                  <td className="py-2 px-2">{row.note || '—'}</td>
                  <td className="py-2 px-2">
                    <button className="text-red-600" onClick={() => del(row)}>Excluir</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-3 text-center text-gray-600">
                    Sem itens no cronograma ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGuard>
  );
}
