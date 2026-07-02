import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="hero container">
      <p className="hero__badge">Week 3 AI Mini-Project</p>
      <h1 className="hero__title">
        Your ideas, <span className="hero__accent">illuminated</span>
      </h1>
      <p className="hero__subtitle">
        Lumenote is a personal notes app for students and thinkers. Capture study notes,
        ideas, and reminders, then use AI to summarize your thinking and plan what to study next.
      </p>
      <div className="hero__actions">
        <Link to="/register" className="btn btn--primary">
          Get started free
        </Link>
        <Link to="/login" className="btn btn--secondary">
          Log in
        </Link>
      </div>

      <div className="features">
        <article className="feature card">
          <h3>Private by default</h3>
          <p>Every note belongs to you. Row Level Security keeps your data isolated.</p>
        </article>
        <article className="feature card">
          <h3>Full CRUD</h3>
          <p>Create, read, update, and delete notes with validation at every layer.</p>
        </article>
        <article className="feature card">
          <h3>AI study helper</h3>
          <p>Summarize saved notes and generate useful follow-up notes from your own content.</p>
        </article>
      </div>
    </section>
  );
}
