import { useEffect, useState } from 'react';

export default function Toast({ text, type='success', onDone }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setShow(false); onDone?.(); }, 2200);
    return () => clearTimeout(t);
  }, [onDone]);
  if (!show) return null;
  return (
    <div className={`fixed bottom-4 right-4 px-4 py-3 rounded shadow text-white ${type==='error'?'bg-red-600':'bg-green-600'}`}>
      {text}
    </div>
  );
}
