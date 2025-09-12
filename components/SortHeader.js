export default function SortHeader({ label, column, sort, setSort, className='' }) {
  const active = sort.key === column;
  const dir = active ? sort.dir : null;
  const nextDir = !active ? 'asc' : (dir === 'asc' ? 'desc' : 'asc');

  return (
    <th
      className={`py-2 px-2 select-none cursor-pointer ${className}`}
      onClick={() => setSort({ key: column, dir: nextDir })}
      title="Clique para ordenar"
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {active && (
          <span className="text-gray-500">{dir === 'asc' ? '▲' : '▼'}</span>
        )}
      </div>
    </th>
  );
}
