import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import RequireRole from '../../components/RequireRole';
import { supabase } from '../../lib/supabaseClient';

export default function AdminAdmissions() {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    supabase.from('admissions_info').select('content').eq('id', 1).single()
      .then(({ data }) => setContent(data?.content || ''));
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setStatus('saving');
    const { error } = await supabase.from('admissions_info').update({ content, updated_at: new Date() }).eq('id', 1);
    setStatus(error ? 'error' : 'saved');
  }

  return (
    <Layout title="Edit Admissions - Admin">
      <RequireRole roles={['admin']}>
        <section className="content">
          <h2>Edit Admissions Info</h2>
          <form className="admin-form" onSubmit={handleSave} style={{ maxWidth: '600px' }}>
            <textarea rows={10} value={content} onChange={(e) => setContent(e.target.value)} />
            <button type="submit" className="btn">Save</button>
            {status === 'saved' && <p className="success-msg">Saved.</p>}
            {status === 'error' && <p className="error-msg">Failed to save.</p>}
          </form>
        </section>
      </RequireRole>
    </Layout>
  );
}
