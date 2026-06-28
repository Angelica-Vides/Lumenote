import { Link } from "react-router-dom";

export default function Login() {
  return (
    <section className="auth container">
      <div className="auth__card card">
        <h1>Log in</h1>
        <p className="muted">Welcome back. Enter your credentials to continue.</p>

        <form className="auth__form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span>Email</span>
            <input type="email" autoComplete="email" placeholder="you@school.edu" required />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" autoComplete="current-password" required />
          </label>
          <button type="submit" className="btn btn--primary btn--block">
            Log in
          </button>
        </form>

        <p className="auth__footer">
          No account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </section>
  );
}
