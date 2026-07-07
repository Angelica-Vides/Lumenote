import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import LogoMark from "./LogoMark";
import NotesTabs from "./NotesTabs";

export default function Layout({ children }) {
  const { user, loading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const showNotesTabs =
    user &&
    (location.pathname === "/dashboard" ||
      location.pathname === "/notes/new" ||
      location.pathname.startsWith("/notes/"));

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
          <Link to={user ? "/dashboard" : "/"} className="logo">
            <LogoMark className="logo__icon" size={30} />
            <span>Lumenote</span>
          </Link>
          <nav className="nav">
            <button
              type="button"
              className="btn btn--ghost btn--sm theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? "☀ Light" : "☾ Dark"}
            </button>
            {user && (
              <>
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
      {showNotesTabs && (
        <div className="app-tabs-wrap">
          <div className="container">
            <NotesTabs />
          </div>
        </div>
      )}
      <main className="main">{children}</main>
      <footer className="footer">
        <div className="container">
          <p>Lumenote — Week 3 AI Mini-Project · FAU HootCamp Summer 2026</p>
        </div>
      </footer>
    </div>
  );
}
