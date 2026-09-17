import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import RequireRole from '../../components/RequireRole';
import { supabase } from '../../lib/supabaseClient';

export default function AdminNews() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  async function load() {
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    setItems(data || []);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError(null);
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase
      .from('news')
      .insert([{ title, content, author_id: session.user.id }]);
    if (error) { setError(error.message); return; }
    setTitle(''); setContent('');
    load();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this notice?')) return;
    await supabase.from('news').delete().eq('id', id);
    load();
  }

  return (
    <Layout title="Manage News - Admin">
      <RequireRole roles={['admin', 'teacher']}>
        <section className="content">
          <h2>Manage News & Notices</h2>

          <form className="admin-form" onSubmit={handleAdd}>
            {error && <p className="error-msg">{error}</p>}
            <input placeholder="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea placeholder="Content" required rows={4} value={content} onChange={(e) => setContent(e.target.value)} />
            <button type="submit" className="btn">Post Notice</button>
          </form>

          <table className="admin-table">
            <thead><tr><th>Title</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td><button className="btn-danger" onClick={() => handleDelete(item.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </RequireRole>
    </Layout>
  );
}
