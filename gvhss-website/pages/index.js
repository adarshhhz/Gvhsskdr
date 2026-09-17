import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout title="GVHSS KADIRUR - Home">
      <section className="hero">
        <div className="hero-content">
          <h2>Welcome to GVHSS KADIRUR</h2>
          <p>Empowering young minds through quality education, creativity and innovation.</p>
          <a href="/about" className="button">Explore Our School</a>
        </div>
      </section>

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
    </Layout>
  );
}
