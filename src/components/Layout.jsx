import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      // Session cleared locally even if network fails
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container header__inner">
          <Link to="/" className="logo">
            <span className="logo__mark">✦</span> Lumenote
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
          <p>Lumenote — Week 2 Assignment</p>
        </div>
      </footer>
    </div>
  );
}
