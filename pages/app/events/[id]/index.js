import Link from 'next/link';
import { useRouter } from 'next/router';
import AuthGuard from '../../../../components/AuthGuard';

export default function EventModules() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <AuthGuard>
      <div className="grid gap-6">
        <div className="card">
          <h1 className="text-xl font-semibold">Módulos do Evento</h1>
          <p className="text-sm text-gray-600">Escolha um módulo para gerenciar.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Link className="btn" href={`/app/events/${id}/dashboard`}>Dashboard</Link>
          <Link className="btn" href={`/app/events/${id}/checklist`}>Checklist</Link>
          <Link className="btn" href={`/app/events/${id}/timeline`}>Cronograma (Dia D)</Link>
          <Link className="btn" href={`/app/events/${id}/guests`}>Convidados & RSVP</Link>
          <Link className="btn" href={`/app/events/${id}/suppliers`}>Fornecedores</Link>
          <Link className="btn" href={`/app/events/${id}/budget`}>Orçamento</Link>
          <Link className="btn" href={`/app/events/${id}/members`}>Membros</Link>
        </div>
      </div>
    </AuthGuard>
  );
}
