import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import RequireRole from '../../components/RequireRole';
import { supabase } from '../../lib/supabaseClient';

export default function AdminContent() {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    supabase.from('page_content').select('key, content')
      .in('key', ['principal_message', 'principal_name'])
      .then(({ data }) => {
        setMessage(data?.find((d) => d.key === 'principal_message')?.content || '');
        setName(data?.find((d) => d.key === 'principal_name')?.content || '');
      });
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setStatus('saving');
    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from('page_content').update({ content: message, updated_at: new Date() }).eq('key', 'principal_message'),
      supabase.from('page_content').update({ content: name, updated_at: new Date() }).eq('key', 'principal_name'),
    ]);
    setStatus(e1 || e2 ? 'error' : 'saved');
  }

  return (
    <Layout title="Edit Site Content - Admin">
      <RequireRole roles={['admin']}>
        <section className="content">
          <h2>Principal&apos;s Message (About Page)</h2>
          <form className="admin-form" onSubmit={handleSave} style={{ maxWidth: '600px' }}>
            <input placeholder="Principal's Name" value={name} onChange={(e) => setName(e.target.value)} />
            <textarea rows={6} placeholder="Message shown on the About page" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button type="submit" className="btn">Save</button>
            {status === 'saved' && <p className="success-msg">Saved.</p>}
            {status === 'error' && <p className="error-msg">Failed to save.</p>}
          </form>
        </section>
      </RequireRole>
    </Layout>
  );
}
