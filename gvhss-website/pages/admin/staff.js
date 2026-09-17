import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import RequireRole from '../../components/RequireRole';
import { supabase } from '../../lib/supabaseClient';

export default function AdminStaff() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', designation: '', subject: '', bio: '' });
  const [error, setError] = useState(null);

  async function load() {
    const { data } = await supabase.from('staff').select('*').order('name');
    setItems(data || []);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.from('staff').insert([form]);
    if (error) { setError(error.message); return; }
    setForm({ name: '', designation: '', subject: '', bio: '' });
    load();
  }

  async function handleDelete(id) {
    if (!confirm('Remove this staff member?')) return;
    await supabase.from('staff').delete().eq('id', id);
    load();
  }

  return (
    <Layout title="Manage Staff - Admin">
      <RequireRole roles={['admin']}>
        <section className="content">
          <h2>Manage Staff Directory</h2>

          <form className="admin-form" onSubmit={handleAdd}>
            {error && <p className="error-msg">{error}</p>}
            <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Designation (e.g. Principal)" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
            <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            <textarea placeholder="Short bio (optional)" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            <button type="submit" className="btn">Add Staff Member</button>
          </form>

          <table className="admin-table">
            <thead><tr><th>Name</th><th>Designation</th><th>Action</th></tr></thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.designation}</td>
                  <td><button className="btn-danger" onClick={() => handleDelete(s.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </RequireRole>
    </Layout>
  );
}
