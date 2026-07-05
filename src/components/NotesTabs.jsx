import { NavLink } from "react-router-dom";

function tabClass({ isActive }) {
  return `app-tabs__tab${isActive ? " app-tabs__tab--active" : ""}`;
}

export default function NotesTabs() {
  return (
    <nav className="app-tabs" aria-label="Notes">
      <NavLink to="/dashboard" className={tabClass} end>
        My Notes
      </NavLink>
      <NavLink to="/notes/new" className={tabClass}>
        New Note
      </NavLink>
    </nav>
  );
}
