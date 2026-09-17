import Link from 'next/link';
import Layout from '../../components/Layout';
import RequireRole from '../../components/RequireRole';

export default function AdminDashboard() {
  return (
    <Layout title="Admin Dashboard - GVHSS KADIRUR">
      <RequireRole roles={['admin', 'teacher']}>
        <section className="content">
          <h2>Admin Dashboard</h2>
          <div className="cards">
            <div className="card">
              <h3>📰 News & Notices</h3>
              <p>Post and manage announcements. Shows in the homepage ticker.</p>
              <Link href="/admin/news" className="button">Manage</Link>
            </div>
            <div className="card">
              <h3>🖼️ Gallery</h3>
              <p>Add or remove photos.</p>
              <Link href="/admin/gallery" className="button">Manage</Link>
            </div>
            <div className="card">
              <h3>💬 Testimonials</h3>
              <p>Quotes from parents, alumni or students, shown on the homepage.</p>
              <Link href="/admin/testimonials" className="button">Manage</Link>
            </div>
            <div className="card">
              <h3>📄 Downloads & Circulars</h3>
              <p>PDF forms and notices for students and parents.</p>
              <Link href="/admin/downloads" className="button">Manage</Link>
            </div>
            <div className="card">
              <h3>👩‍🏫 Staff Directory</h3>
              <p>Admin only — edit staff listings.</p>
              <Link href="/admin/staff" className="button">Manage</Link>
            </div>
            <div className="card">
              <h3>🎓 Admissions Info</h3>
              <p>Admin only — edit the admissions page text.</p>
              <Link href="/admin/admissions" className="button">Manage</Link>
            </div>
            <div className="card">
              <h3>🧑‍💼 Principal&apos;s Message</h3>
              <p>Admin only — edit the About page welcome message.</p>
              <Link href="/admin/content" className="button">Manage</Link>
            </div>
            <div className="card">
              <h3>👥 Users & Roles</h3>
              <p>Admin only — create accounts, assign roles.</p>
              <Link href="/admin/users" className="button">Manage</Link>
            </div>
            <div className="card">
              <h3>✉️ Contact Messages</h3>
              <p>Admin only — view messages from the contact form.</p>
              <Link href="/admin/messages" className="button">View</Link>
            </div>
          </div>
        </section>
      </RequireRole>
    </Layout>
  );
}
