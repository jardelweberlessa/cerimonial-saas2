import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AuthGuard from '../../../../components/AuthGuard';
import { supabase } from '../../../../lib/supabaseClient';

export default function EventOverview() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => setEvent(data));
  }, [id]);

  return (
    <AuthGuard>
      <div className="grid gap-6">
        <div className="card">
          <h1 className="text-xl font-semibold">
            {event ? event.name : 'Carregando...'}
          </h1>
          <p className="text-sm text-gray-600">Escolha um módulo:</p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Link className="btn" href={`/app/events/${id}/dashboard`}>
              Dashboard
            </Link>
            <Link className="btn" href={`/app/events/${id}/checklist`}>
              Checklist
            </Link>
            <Link className="btn" href={`/app/events/${id}/timeline`}>
              Cronograma (Dia D)
            </Link>
            <Link className="btn" href={`/app/events/${id}/guests`}>
              Convidados & RSVP
            </Link>
            <Link className="btn" href={`/app/events/${id}/suppliers`}>
              Fornecedores
            </Link>
            <Link className="btn" href={`/app/events/${id}/budget`}>
              Orçamento
            </Link>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
