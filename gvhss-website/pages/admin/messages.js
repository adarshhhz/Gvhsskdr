import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import RequireRole from '../../components/RequireRole';
import { supabase } from '../../lib/supabaseClient';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setMessages(data || []));
  }, []);

  return (
    <Layout title="Contact Messages - Admin">
      <RequireRole roles={['admin']}>
        <section className="content">
          <h2>Contact Messages</h2>
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Message</th><th>Date</th></tr></thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.message}</td>
                  <td>{new Date(m.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </RequireRole>
    </Layout>
  );
}
