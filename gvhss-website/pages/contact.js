import { useState } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'sending' | 'sent' | 'error'

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    const { error } = await supabase.from('contact_messages').insert([form]);
    if (error) {
      setStatus('error');
    } else {
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    }
  }

  return (
    <Layout title="Contact - GVHSS KADIRUR">
      <section className="page-banner">
        <h2>Contact Us</h2>
        <p>We would love to hear from you.</p>
      </section>

      <section className="content">
        <div className="card">
          <h3>📍 Address</h3>
          <p>Goverment Vocational Higher Secondary School</p>
          <p>Kerala, India</p>
          <h3>📞 Phone</h3>
          <p>+91 98765 43210</p>
          <h3>📧 Email</h3>
          <p>info@gvhsskadirur.edu</p>
        </div>

        <h2>Send a Message</h2>
        <form onSubmit={handleSubmit}>
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
          {status === 'sent' && <p className="success-msg">Message sent — thank you!</p>}
          {status === 'error' && <p className="error-msg">Something went wrong. Please try again.</p>}
        </form>
      </section>
    </Layout>
  );
}
