import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('staff')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setStaff(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <Layout title="Staff - GVHSS KADIRUR">
      <section className="page-banner">
        <h2>Our Staff</h2>
        <p>Meet the educators who make our school great.</p>
      </section>

      <section className="content">
        {loading && <p>Loading staff directory...</p>}
        {!loading && staff.length === 0 && (
          <p>Staff directory will appear here once added by an admin.</p>
        )}
        <div className="cards">
          {staff.map((member) => (
            <div className="card" key={member.id}>
              <h3>{member.name}</h3>
              <p>{member.designation}{member.subject ? ` • ${member.subject}` : ''}</p>
              {member.bio && <p>{member.bio}</p>}
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
