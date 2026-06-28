import { Link } from "react-router-dom";

export default function Register() {
  return (
    <section className="auth container">
      <div className="auth__card card">
        <h1>Create account</h1>
        <p className="muted">Sign up to start writing notes.</p>

        <form className="auth__form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span>Email</span>
            <input type="email" autoComplete="email" required />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" autoComplete="new-password" minLength={6} required />
          </label>
          <label className="field">
            <span>Confirm password</span>
            <input type="password" autoComplete="new-password" minLength={6} required />
          </label>
          <button type="submit" className="btn btn--primary btn--block">
            Sign up
          </button>
        </form>

        <p className="auth__footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  );
}
