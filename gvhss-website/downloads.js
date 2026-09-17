import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';

export default function Downloads() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('downloads')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setItems(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <Layout title="Downloads - GVHSS KADIRUR">
      <section className="page-banner">
        <h2>Downloads & Circulars</h2>
        <p>Forms, circulars and documents for students and parents.</p>
      </section>

      <section className="content">
        {loading && <p>Loading...</p>}
        {!loading && items.length === 0 && <p>No documents uploaded yet.</p>}
        {items.map((item) => (
          <div className="download-item" key={item.id}>
            <span>📄 {item.title}</span>
            <a href={item.file_url} className="button" style={{ background: 'var(--navy)', color: 'white', padding: '8px 16px' }} target="_blank" rel="noopener noreferrer">
              Download
            </a>
          </div>
        ))}
      </section>
    </Layout>
  );
}
