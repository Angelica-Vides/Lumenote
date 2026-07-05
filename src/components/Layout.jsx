import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoMark from "./LogoMark";

export default function Layout({ children }) {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/", { replace: true });
    } catch {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container header__inner">
          <Link to="/" className="logo">
            <LogoMark className="logo__icon" size={30} />
            <span>Lumenote</span>
          </Link>
          <nav className="nav">
            {user && (
              <>
                <NavLink to="/dashboard" className="nav__link">
                  My Notes
                </NavLink>
                <span className="nav__email">{user.email}</span>
                <button type="button" className="btn btn--ghost btn--sm" onClick={handleSignOut}>
                  Sign out
                </button>
              </>
            )}
            {!loading && !user && (
              <>
                <NavLink to="/login" className="nav__link">
                  Log in
                </NavLink>
                <Link to="/register" className="btn btn--primary btn--sm">
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <div className="container">
          <p>Lumenote — Week 3 AI Mini-Project · FAU HootCamp Summer 2026</p>
        </div>
      </footer>
    </div>
  );
}
