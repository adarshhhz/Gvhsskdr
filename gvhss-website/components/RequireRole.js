import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

// Wrap any admin page: <RequireRole roles={['admin']}>...</RequireRole>
// Redirects to /login if not signed in, or to / if signed in but
// without the right role. This is a UX convenience only — the real
// security boundary is the Row Level Security policies in Supabase,
// which block unauthorized reads/writes regardless of the UI.
export default function RequireRole({ roles, children }) {
  const router = useRouter();
  const [status, setStatus] = useState('checking'); // checking | allowed | denied

  useEffect(() => {
    let active = true;

    async function check() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (active) { setStatus('denied'); router.replace('/login'); }
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!active) return;
      if (profile && roles.includes(profile.role)) {
        setStatus('allowed');
      } else {
        setStatus('denied');
        router.replace('/');
      }
    }

    check();
    return () => { active = false; };
  }, [roles, router]);

  if (status === 'checking') return <section className="content"><p>Checking access...</p></section>;
  if (status === 'denied') return null;
  return children;
}
