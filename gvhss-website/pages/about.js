import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout title="About Us - GVHSS KADIRUR">
      <section className="page-banner">
        <h2>About Our School</h2>
        <p>Learn more about our school and our vision.</p>
      </section>

      <section className="content">
        <h2>Who We Are</h2>
        <p>
          GVHSS KADIRUR is an institution dedicated to providing quality
          education and developing responsible and confident students.
        </p>

        <h2>Our Vision</h2>
        <p>
          To create an inspiring learning environment where every student
          can discover their talents and achieve their goals.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is to provide quality education while encouraging
          creativity, discipline, innovation and social responsibility.
        </p>

        <h2>Our Facilities</h2>
        <div className="cards">
          <div className="card">
            <h3>🔬 Science Laboratory</h3>
            <p>Modern learning facilities for practical science education.</p>
          </div>
          <div className="card">
            <h3>📚 Library</h3>
            <p>A collection of books and resources for students.</p>
          </div>
          <div className="card">
            <h3>💻 Computer Lab</h3>
            <p>Computer facilities for digital learning and technology.</p>
          </div>
          <div className="card">
            <h3>⚽ Sports</h3>
            <p>Facilities that encourage physical activity and teamwork.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
