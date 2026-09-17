import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import RequireRole from '../../components/RequireRole';
import { supabase } from '../../lib/supabaseClient';

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', role: '', message: '' });
  const [error, setError] = useState(null);

  async function load() {
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    setItems(data || []);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.from('testimonials').insert([form]);
    if (error) { setError(error.message); return; }
    setForm({ name: '', role: '', message: '' });
    load();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this testimonial?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    load();
  }

  return (
    <Layout title="Manage Testimonials - Admin">
      <RequireRole roles={['admin', 'teacher']}>
        <section className="content">
          <h2>Manage Testimonials</h2>
          <p style={{ fontSize: '0.9em' }}>These appear on the homepage — quotes from parents, alumni or students.</p>

          <form className="admin-form" onSubmit={handleAdd}>
            {error && <p className="error-msg">{error}</p>}
            <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Role (e.g. Parent, Alumni, Class 10)" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            <textarea placeholder="Their message / quote" required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <button type="submit" className="btn">Add Testimonial</button>
          </form>

          <table className="admin-table">
            <thead><tr><th>Name</th><th>Role</th><th>Action</th></tr></thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>{t.role}</td>
                  <td><button className="btn-danger" onClick={() => handleDelete(t.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </RequireRole>
    </Layout>
  );
}
