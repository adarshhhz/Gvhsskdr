import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import RequireRole from '../../components/RequireRole';
import { supabase } from '../../lib/supabaseClient';

export default function AdminDownloads() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', file_url: '' });
  const [error, setError] = useState(null);

  async function load() {
    const { data } = await supabase.from('downloads').select('*').order('created_at', { ascending: false });
    setItems(data || []);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.from('downloads').insert([form]);
    if (error) { setError(error.message); return; }
    setForm({ title: '', file_url: '' });
    load();
  }

  async function handleDelete(id) {
    if (!confirm('Remove this document?')) return;
    await supabase.from('downloads').delete().eq('id', id);
    load();
  }

  return (
    <Layout title="Manage Downloads - Admin">
      <RequireRole roles={['admin', 'teacher']}>
        <section className="content">
          <h2>Manage Downloads & Circulars</h2>
          <p style={{ fontSize: '0.9em' }}>
            Upload your PDF to a free file host (like Google Drive with
            &quot;anyone with the link&quot; sharing) and paste the direct link here.
          </p>

          <form className="admin-form" onSubmit={handleAdd}>
            {error && <p className="error-msg">{error}</p>}
            <input placeholder="Document Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input placeholder="File URL (PDF link)" required value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} />
            <button type="submit" className="btn">Add Document</button>
          </form>

          <table className="admin-table">
            <thead><tr><th>Title</th><th>Action</th></tr></thead>
            <tbody>
              {items.map((d) => (
                <tr key={d.id}>
                  <td>{d.title}</td>
                  <td><button className="btn-danger" onClick={() => handleDelete(d.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </RequireRole>
    </Layout>
  );
}
