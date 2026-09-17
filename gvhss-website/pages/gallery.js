import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setImages(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <Layout title="Gallery - GVHSS KADIRUR">
      <section className="page-banner">
        <h2>Gallery</h2>
        <p>Moments and memories from our school.</p>
      </section>

      <section className="content">
        {loading && <p>Loading gallery...</p>}
        {!loading && images.length === 0 && <p>No images added yet.</p>}
        <div className="cards">
          {images.map((img) => (
            <div className="card gallery-thumb" key={img.id} onClick={() => setActive(img)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.image_url} alt={img.caption || 'School photo'} style={{ width: '100%', borderRadius: '6px' }} />
              {img.caption && <p>{img.caption}</p>}
            </div>
          ))}
        </div>
      </section>

      {active && (
        <div className="lightbox-overlay" onClick={() => setActive(null)}>
          <button className="lightbox-close" onClick={() => setActive(null)} aria-label="Close">✕</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={active.image_url} alt={active.caption || ''} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </Layout>
  );
}
