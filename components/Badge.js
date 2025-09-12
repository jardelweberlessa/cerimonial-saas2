export default function Badge({ children, tone='info' }) {
  const map = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warn: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800',
    violet: 'bg-violet-100 text-violet-800',
  };
  const cls = map[tone] || map.info;
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${cls}`}>
      {children}
    </span>
  );
}
