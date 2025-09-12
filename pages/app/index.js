import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

export default function AppIndex() {
  const router = useRouter();
  useEffect(() => {
    const go = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      router.replace(session ? '/app/events' : '/login');
    };
    go();
  }, [router]);
  return null;
}
