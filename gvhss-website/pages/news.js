import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setNews(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <Layout title="News & Notices - GVHSS KADIRUR">
      <section className="page-banner">
        <h2>News & Notices</h2>
        <p>Stay updated with the latest from our school.</p>
      </section>

      <section className="content">
        {loading && <p>Loading news...</p>}
        {!loading && news.length === 0 && <p>No notices posted yet.</p>}
        {news.map((item) => (
          <div className="card" key={item.id} style={{ marginBottom: '16px' }}>
            <h3>{item.title}</h3>
            <p style={{ fontSize: '0.85em', opacity: 0.7 }}>
              {new Date(item.created_at).toLocaleDateString()}
            </p>
            <p>{item.content}</p>
          </div>
        ))}
      </section>
    </Layout>
  );
}
