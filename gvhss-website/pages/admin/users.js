import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import RequireRole from '../../components/RequireRole';
import { supabase } from '../../lib/supabaseClient';

export default function AdminUsers() {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({ email: '', fullName: '', role: 'student', password: '' });
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);

  async function load() {
    const { data } = await supabase.from('profiles').select('*').order('full_name');
    setProfiles(data || []);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);
    setStatus('creating');
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch('/api/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(form),
    });
    const result = await res.json();
    if (!res.ok) {
      setError(result.error);
      setStatus(null);
      return;
    }
    setStatus('created');
    setForm({ email: '', fullName: '', role: 'student', password: '' });
    load();
  }

  async function handleRoleChange(id, role) {
    await supabase.from('profiles').update({ role }).eq('id', id);
    load();
  }

  return (
    <Layout title="Manage Users - Admin">
      <RequireRole roles={['admin']}>
        <section className="content">
          <h2>Users & Roles</h2>

          <h3>Create New Login</h3>
          <form className="admin-form" onSubmit={handleCreate}>
            {error && <p className="error-msg">{error}</p>}
            {status === 'created' && <p className="success-msg">Account created.</p>}
            <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={{ marginBottom: '12px', width: '100%', padding: '10px' }}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
            <input type="password" placeholder="Temporary Password (min 8 chars)" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="submit" className="btn" disabled={status === 'creating'}>
              {status === 'creating' ? 'Creating...' : 'Create Account'}
            </button>
            <p style={{ fontSize: '0.85em', marginTop: '8px' }}>
              Share this password with the user privately and ask them to
              change it after their first login.
            </p>
          </form>

          <h3>Existing Users</h3>
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Role</th><th>Change Role</th></tr></thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.id}>
                  <td>{p.full_name || '(no name set)'}</td>
                  <td><span className="role-badge">{p.role}</span></td>
                  <td>
                    <select defaultValue={p.role} onChange={(e) => handleRoleChange(p.id, e.target.value)}>
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </RequireRole>
    </Layout>
  );
}
