import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  PenTool,
  BookOpen,
  Image,
  Smile,
  Lightbulb,
  Menu,
  X,
} from "lucide-react";

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: "/app", icon: Home, label: "Home", exact: true },
    { to: "/app/write", icon: PenTool, label: "Write" },
    { to: "/app/feed", icon: BookOpen, label: "Feed" },
    { to: "/app/gallery", icon: Image, label: "Gallery" },
    { to: "/app/moods", icon: Smile, label: "Moods" },
    { to: "/app/ideas", icon: Lightbulb, label: "Ideas" },
  ];

  // Close drawer when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="mobile-menu-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`app-sidebar ${isOpen ? "open" : ""}`}>
        {/* Close button for mobile */}
        <button
          className="mobile-menu-close"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          <X size={24} />
        </button>

        <div className="app-logo">
          <div className="logo-avatar-container">
            <img
              src="/album/photo_2026-02-13_16-36-54.jpg"
              alt="Anita"
              className="logo-avatar"
            />
            <span className="logo-emoji">❤️</span>
          </div>
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
    </>
  );
}

export default Navigation;
