import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import RequireRole from '../../components/RequireRole';
import { supabase } from '../../lib/supabaseClient';

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [error, setError] = useState(null);

  async function load() {
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    setItems(data || []);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.from('gallery').insert([{ image_url: imageUrl, caption }]);
    if (error) { setError(error.message); return; }
    setImageUrl(''); setCaption('');
    load();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this image?')) return;
    await supabase.from('gallery').delete().eq('id', id);
    load();
  }

  return (
    <Layout title="Manage Gallery - Admin">
      <RequireRole roles={['admin', 'teacher']}>
        <section className="content">
          <h2>Manage Gallery</h2>
          <p style={{ fontSize: '0.9em' }}>
            Paste an image URL. To host your own images, create a Storage
            bucket in Supabase, upload there, and paste the public URL here.
          </p>

          <form className="admin-form" onSubmit={handleAdd}>
            {error && <p className="error-msg">{error}</p>}
            <input placeholder="Image URL" required value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            <input placeholder="Caption (optional)" value={caption} onChange={(e) => setCaption(e.target.value)} />
            <button type="submit" className="btn">Add Image</button>
          </form>

          <div className="cards">
            {items.map((img) => (
              <div className="card" key={img.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.image_url} alt={img.caption || ''} style={{ width: '100%', borderRadius: '6px' }} />
                <p>{img.caption}</p>
                <button className="btn-danger" onClick={() => handleDelete(img.id)}>Delete</button>
              </div>
            ))}
          </div>
        </section>
      </RequireRole>
    </Layout>
  );
}
