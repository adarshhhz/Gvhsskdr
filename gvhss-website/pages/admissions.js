import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';

export default function Admissions() {
  const [content, setContent] = useState('Loading...');

  useEffect(() => {
    supabase
      .from('admissions_info')
      .select('content')
      .eq('id', 1)
      .single()
      .then(({ data }) => setContent(data?.content || 'Admissions information coming soon.'));
  }, []);

  return (
    <Layout title="Admissions - GVHSS KADIRUR">
      <section className="page-banner">
        <h2>Admissions</h2>
        <p>How to join GVHSS KADIRUR.</p>
      </section>

      <section className="content">
        <p style={{ whiteSpace: 'pre-wrap' }}>{content}</p>
      </section>
    </Layout>
  );
}
