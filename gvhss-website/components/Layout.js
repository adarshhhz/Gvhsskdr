import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Layout({ title = 'GVHSS KADIRUR', children }) {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setRole(null); return; }
    supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => setRole(data?.role || null));
  }, [session]);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <header>
        <div className="logo">GVHSS</div>
        <div className="school-name">
          <h1>GVHSS KADIRUR</h1>
          <p>Knowledge • Character • Excellence</p>
        </div>
      </header>

      <nav>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/staff">Staff</Link>
        <Link href="/news">News</Link>
        <Link href="/gallery">Gallery</Link>
        <Link href="/admissions">Admissions</Link>
        <Link href="/contact">Contact</Link>
        {role === 'admin' || role === 'teacher' ? (
          <Link href="/admin">Admin</Link>
        ) : null}
        {session ? (
          <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </nav>

      <main>{children}</main>

      <footer>
        <h3>Goverment Vocational Higher Secondary School</h3>
        <p>Knowledge • Character • Excellence</p>
        <p>© {new Date().getFullYear()} GVHSS KADIRUR. All Rights Reserved.</p>
      </footer>
    </>
  );
}
