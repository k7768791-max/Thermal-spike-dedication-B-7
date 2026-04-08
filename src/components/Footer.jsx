import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: "#040810", borderTop: "1px solid rgba(0,229,255,0.08)" }}
      className="mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌡️</span>
              <span style={{ fontFamily: "Rajdhani,sans-serif", color: "#00e5ff", letterSpacing: "3px", fontSize: "18px", fontWeight: 700 }}>
                THERMAL<span style={{ color: "#ffab00" }}>SPIKE</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "#607d8b" }}>
              AI-powered thermal spike detection for enterprise data centres. Real-time monitoring,
              predictive insights, and automated alerts.
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-4">
              {["twitter","linkedin","github"].map(s => (
                <a key={s} href="#" className="w-8 h-8 rounded flex items-center justify-center transition-colors"
                  style={{ border: "1px solid rgba(0,229,255,0.15)", color: "#607d8b" }}
                  onMouseEnter={e => e.target.style.borderColor = "#00e5ff"}
                  onMouseLeave={e => e.target.style.borderColor = "rgba(0,229,255,0.15)"}>
                  {s === "twitter" && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.43.36a9 9 0 01-2.88 1.1A4.52 4.52 0 0016.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.1 1.03A12.84 12.84 0 011.64.89a4.52 4.52 0 001.4 6.03A4.5 4.5 0 011 6.36v.06a4.52 4.52 0 003.62 4.43 4.6 4.6 0 01-2.04.08 4.53 4.53 0 004.22 3.14 9.07 9.07 0 01-5.6 1.93c-.36 0-.72-.02-1.08-.06A12.8 12.8 0 007 21c8.4 0 13-6.96 13-13v-.59A9.3 9.3 0 0023 3z"/></svg>}
                  {s === "linkedin" && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zm2-4a2 2 0 100-4 2 2 0 000 4z"/></svg>}
                  {s === "github" && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontFamily: "Rajdhani,sans-serif", color: "#00e5ff", letterSpacing: "2px", fontSize: "12px", fontWeight: 700, marginBottom: "12px" }}>PLATFORM</h4>
            {[["Home","/"],["About","/about"],["Contact","/contact"],["Login","/login"]].map(([l,t]) => (
              <Link key={t} to={t} className="block mb-2 text-sm transition-colors"
                style={{ color: "#607d8b" }}
                onMouseEnter={e => e.target.style.color = "#dde4f0"}
                onMouseLeave={e => e.target.style.color = "#607d8b"}>
                {l}
              </Link>
            ))}
          </div>

          <div>
            <h4 style={{ fontFamily: "Rajdhani,sans-serif", color: "#00e5ff", letterSpacing: "2px", fontSize: "12px", fontWeight: 700, marginBottom: "12px" }}>FEATURES</h4>
            {["Thermal Spike Detection","AI Analysis","Real-time Monitoring","Subscription Plans","Admin Dashboard"].map(f => (
              <p key={f} className="mb-2 text-sm" style={{ color: "#607d8b" }}>{f}</p>
            ))}
          </div>

          <div>
            <h4 style={{ fontFamily: "Rajdhani,sans-serif", color: "#00e5ff", letterSpacing: "2px", fontSize: "12px", fontWeight: 700, marginBottom: "12px" }}>CONTACT</h4>
            <p className="text-sm mb-2" style={{ color: "#607d8b" }}>📍 Hyderabad, Telangana, India</p>
            <p className="text-sm mb-2" style={{ color: "#607d8b" }}>📧 support@thermalspike.ai</p>
            <p className="text-sm mb-2" style={{ color: "#607d8b" }}>📞 +91 40 1234 5678</p>
          </div>
        </div>

        <div className="mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2"
          style={{ borderTop: "1px solid rgba(0,229,255,0.08)" }}>
          <p className="text-xs" style={{ color: "#607d8b" }}>
            © {year} ThermalSpike AI. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "#607d8b", fontFamily: "Share Tech Mono,monospace" }}>
            Powered by XGBoost · Built with ❤️ in Hyderabad
          </p>
        </div>
      </div>
    </footer>
  );
}
