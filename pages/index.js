// pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const go = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      router.replace(session ? '/app' : '/login');
    };
    go();
  }, [router]);
  return null;
}
