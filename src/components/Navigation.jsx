import { NavLink } from "react-router-dom";
import { Home, PenTool, BookOpen, Image, Smile, Lightbulb } from "lucide-react";

function Navigation() {
  const navItems = [
    { to: "/app", icon: Home, label: "Home", exact: true },
    { to: "/app/write", icon: PenTool, label: "Write" },
    { to: "/app/feed", icon: BookOpen, label: "Feed" },
    { to: "/app/gallery", icon: Image, label: "Gallery" },
    { to: "/app/moods", icon: Smile, label: "Moods" },
    { to: "/app/ideas", icon: Lightbulb, label: "Ideas" },
  ];

  return (
    <aside className="app-sidebar">
      <div className="app-logo">
        <h1>Anita's Space</h1>
        <p>Your Creative Sanctuary</p>
      </div>

      <nav>
        <ul className="app-nav">
          {navItems.map((item) => (
            <li key={item.to} className="app-nav-item">
              <NavLink
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  isActive ? "app-nav-link active" : "app-nav-link"
                }
              >
                <item.icon />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Navigation;
