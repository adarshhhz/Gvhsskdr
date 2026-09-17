import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Layout({ title = 'GVHSS KADIRUR', children }) {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
        <button
          className="nav-toggle"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </header>

      <nav className={menuOpen ? 'open' : ''}>
        <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
        <Link href="/staff" onClick={() => setMenuOpen(false)}>Staff</Link>
        <Link href="/news" onClick={() => setMenuOpen(false)}>News</Link>
        <Link href="/gallery" onClick={() => setMenuOpen(false)}>Gallery</Link>
        <Link href="/downloads" onClick={() => setMenuOpen(false)}>Downloads</Link>
        <Link href="/admissions" onClick={() => setMenuOpen(false)}>Admissions</Link>
        <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        {role === 'admin' || role === 'teacher' ? (
          <Link href="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
        ) : null}
        {session ? (
          <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a>
        ) : (
          <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
        )}
      </nav>

      <main>{children}</main>

      <footer>
        <h3>Goverment Vocational Higher Secondary School</h3>
        <p>Knowledge • Character • Excellence</p>
        <div className="social-row" style={{ justifyContent: 'center' }}>
          <a href="#" aria-label="Facebook" title="Facebook">f</a>
          <a href="#" aria-label="YouTube" title="YouTube">▶</a>
          <a href="#" aria-label="Instagram" title="Instagram">◎</a>
        </div>
        <p style={{ marginTop: '12px' }}>© {new Date().getFullYear()} GVHSS KADIRUR. All Rights Reserved.</p>
      </footer>
    </>
  );
}
