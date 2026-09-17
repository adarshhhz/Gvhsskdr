import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [notices, setNotices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    supabase
      .from('news')
      .select('title')
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => setNotices(data || []));

    supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => setTestimonials(data || []));
  }, []);

  return (
    <Layout title="GVHSS KADIRUR - Home">
      {notices.length > 0 && (
        <div className="ticker-wrap">
          <div className="ticker-track">
            {notices.map((n, i) => (
              <span key={i}>📢 {n.title}</span>
            ))}
          </div>
        </div>
      )}

      <section className="hero">
        <div className="hero-content">
          <h2>Welcome to GVHSS KADIRUR</h2>
          <p>Empowering young minds through quality education, creativity and innovation.</p>
          <a href="/about" className="button">Explore Our School</a>
        </div>
      </section>

      <div className="quicklinks">
        <a className="quicklink" href="/admissions">
          <span className="emoji">🎓</span>Admissions
        </a>
        <a className="quicklink" href="/news">
          <span className="emoji">📰</span>News & Notices
        </a>
        <a className="quicklink" href="/gallery">
          <span className="emoji">🖼️</span>Gallery
        </a>
        <a className="quicklink" href="/downloads">
          <span className="emoji">📄</span>Downloads
        </a>
        <a className="quicklink" href="/contact">
          <span className="emoji">📞</span>Contact Us
        </a>
      </div>

      <section className="welcome">
        <h2>Welcome to Our School</h2>
        <p>
          GVHSS KADIRUR is committed to providing a supportive and inspiring
          environment where students can learn, grow and achieve their dreams.
        </p>
      </section>

      <section className="highlights">
        <section className="stats">
          <div><h2>1200+</h2><p>Students</p></div>
          <div><h2>75+</h2><p>Teachers</p></div>
          <div><h2>25+</h2><p>Years of Excellence</p></div>
          <div><h2>50+</h2><p>Achievements</p></div>
        </section>

        <h2>School Highlights</h2>
        <div className="cards">
          <div className="card">
            <h3>📚 Quality Education</h3>
            <p>Experienced teachers and a student-friendly learning environment.</p>
          </div>
          <div className="card">
            <h3>🔬 Science & Innovation</h3>
            <p>Encouraging students to explore science, technology and new ideas.</p>
          </div>
          <div className="card">
            <h3>🏆 Achievements</h3>
            <p>Celebrating excellence in academics, sports, arts and other activities.</p>
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="testimonials">
          <div className="testimonials-inner">
            <h2 style={{ color: 'var(--navy)', marginBottom: '20px' }}>What People Say</h2>
            <div className="cards">
              {testimonials.map((t) => (
                <div className="testimonial-card" key={t.id}>
                  <p className="msg">{t.message}</p>
                  <p className="who">{t.name}</p>
                  {t.role && <p className="role">{t.role}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
