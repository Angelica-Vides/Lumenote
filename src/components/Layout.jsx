import { Link, NavLink } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="app">
      <header className="header">
        <div className="container header__inner">
          <Link to="/" className="logo">
            <span className="logo__mark">✦</span> Lumenote
          </Link>
          <nav className="nav">
            <NavLink to="/dashboard" className="nav__link">
              My Notes
            </NavLink>
            <NavLink to="/login" className="nav__link">
              Log in
            </NavLink>
            <Link to="/register" className="btn btn--primary btn--sm">
              Sign up
            </Link>
          </nav>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <div className="container">
          <p>Lumenote — Week 2 Assignment</p>
        </div>
      </footer>
    </div>
  );
}
