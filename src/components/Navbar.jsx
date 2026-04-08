import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🌡️</span>
          <span
            style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "3px", color: "#00e5ff" }}
            className="text-xl font-bold hidden sm:block"
          >
            THERMAL<span style={{ color: "#ffab00" }}>SPIKE</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors duration-200 hover:text-cyan-400 ${
                location.pathname === l.to ? "text-cyan-400" : "text-gray-400"
              }`}
              style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "1.5px", fontSize: "14px" }}
            >
              {l.label.toUpperCase()}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-1.5 rounded text-sm font-semibold transition-all"
                style={{
                  background: "linear-gradient(135deg,#005f64,#007a82)",
                  border: "1px solid #00e5ff",
                  color: "#e0f7fa",
                  fontFamily: "Rajdhani,sans-serif",
                  letterSpacing: "1px",
                }}
              >
                DASHBOARD
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 rounded text-sm font-semibold transition-all"
                style={{
                  border: "1px solid rgba(0,229,255,0.3)",
                  color: "#607d8b",
                  fontFamily: "Rajdhani,sans-serif",
                  letterSpacing: "1px",
                }}
              >
                SIGN OUT
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-5 py-1.5 rounded text-sm font-bold transition-all hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg,#005f64,#007a82)",
                border: "1px solid #00e5ff",
                color: "#e0f7fa",
                fontFamily: "Rajdhani,sans-serif",
                letterSpacing: "2px",
              }}
            >
              LOGIN
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-gray-400" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-cyan-500 border-opacity-10 px-4 pb-4 pt-2 flex flex-col gap-3">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
              className="text-gray-400 hover:text-cyan-400 py-1"
              style={{ fontFamily: "Rajdhani,sans-serif", letterSpacing: "1.5px" }}>
              {l.label.toUpperCase()}
            </Link>
          ))}
          {user ? (
            <>
              <button onClick={() => { navigate("/dashboard"); setMenuOpen(false); }}
                className="text-left text-cyan-400 py-1" style={{ fontFamily: "Rajdhani,sans-serif" }}>
                DASHBOARD
              </button>
              <button onClick={handleLogout} className="text-left text-gray-500 py-1" style={{ fontFamily: "Rajdhani,sans-serif" }}>
                SIGN OUT
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="text-cyan-400 py-1"
              style={{ fontFamily: "Rajdhani,sans-serif" }}>
              LOGIN
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
