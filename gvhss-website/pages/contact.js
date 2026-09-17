import { useState } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'sending' | 'sent' | 'error'
  const [fieldError, setFieldError] = useState(null);

  function validate() {
    if (form.name.trim().length < 2) return 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Please enter a valid email.';
    if (form.message.trim().length < 10) return 'Message should be at least 10 characters.';
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) { setFieldError(err); return; }
    setFieldError(null);
    setStatus('sending');
    const { error } = await supabase.from('contact_messages').insert([form]);
    if (error) {
      setStatus('error');
    } else {
      setStatus('sent');
      setForm({ name: '', email: '', phone: '', message: '' });
    }
  }

  return (
    <Layout title="Contact - GVHSS KADIRUR">
      <section className="page-banner">
        <h2>Contact Us</h2>
        <p>We would love to hear from you.</p>
      </section>

      <section className="content">
        <div className="contact-grid">
          <div>
            <div className="card">
              <h3>📍 Address</h3>
              <p>Goverment Vocational Higher Secondary School</p>
              <p>Kadirur, Kerala, India</p>
              <h3 style={{ marginTop: '16px' }}>📞 Phone</h3>
              <p>+91 98765 43210</p>
              <h3 style={{ marginTop: '16px' }}>📧 Email</h3>
              <p>info@gvhsskadirur.edu</p>

              <div className="social-row">
                <a href="#" aria-label="Facebook" title="Facebook">f</a>
                <a href="#" aria-label="YouTube" title="YouTube">▶</a>
                <a href="#" aria-label="Instagram" title="Instagram">◎</a>
              </div>
            </div>

            <iframe
              className="map-frame"
              title="School location"
              src="https://maps.google.com/maps?q=Kadirur%2C%20Kerala&t=&z=13&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
            />
          </div>

          <div>
            <h2>Send a Message</h2>
            <form onSubmit={handleSubmit}>
              {fieldError && <p className="error-msg">{fieldError}</p>}
              <input
                type="text"
                placeholder="Your Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Your Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <textarea
                placeholder="Your Message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <button type="submit" className="btn" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
              {status === 'sent' && (
                <p className="success-msg">✅ Message sent — thank you! We&apos;ll get back to you soon.</p>
              )}
              {status === 'error' && (
                <p className="error-msg">Something went wrong. Please try again in a moment.</p>
              )}
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
