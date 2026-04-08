import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const STATS = [
  { value: "99.7%", label: "Detection Accuracy" },
  { value: "<5ms", label: "Inference Latency" },
  { value: "20K+", label: "Records Trained" },
  { value: "200+", label: "Servers Monitored" },
];

const FEATURES = [
  {
    icon: "⚡",
    title: "Real-Time Spike Detection",
    desc: "XGBoost classifier analyses 5,155 sensor signals in under 5ms to predict thermal spikes before they occur.",
    color: "#00e5ff",
  },
  {
    icon: "📊",
    title: "Live Data Dashboard",
    desc: "Interactive charts and KPIs give your team a real-time view of your data centre's thermal health.",
    color: "#ffab00",
  },
  {
    icon: "🔒",
    title: "Enterprise Security",
    desc: "Firebase Authentication with Google SSO, role-based access control, and encrypted data at rest.",
    color: "#00e676",
  },
  {
    icon: "💳",
    title: "Flexible Subscriptions",
    desc: "3 free predictions included. Upgrade anytime via Razorpay for unlimited AI analysis access.",
    color: "#ff3d57",
  },
  {
    icon: "🤖",
    title: "AI Root Cause Analysis",
    desc: "Not just a prediction — get diagnosed causes and actionable solutions for every detected spike.",
    color: "#00e5ff",
  },
  {
    icon: "🏢",
    title: "Multi-Zone Management",
    desc: "Monitor Zone-A through Zone-D independently. Admin dashboard gives full cross-zone visibility.",
    color: "#ffab00",
  },
];

const HOW_STEPS = [
  { n: "01", title: "Register Your Data Centre", desc: "Sign in with Google and complete your data centre profile in under 60 seconds." },
  { n: "02", title: "Connect Sensor Telemetry", desc: "Enter real-time server telemetry — temperatures, cooling capacity, workload metrics — into the AI Analysis page." },
  { n: "03", title: "Get Instant Predictions", desc: "Our XGBoost model returns a binary spike risk prediction with probability score in milliseconds." },
  { n: "04", title: "Act on AI Recommendations", desc: "Receive identified causes and step-by-step remediation suggestions specific to your server conditions." },
];

function HeroAnimation() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div
        className="rounded-2xl p-6"
        style={{ background: "#0f1826", border: "1px solid rgba(0,229,255,0.15)" }}
      >
        {/* Top bar */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="ml-2 text-xs" style={{ fontFamily: "Share Tech Mono,monospace", color: "#607d8b" }}>
            SERVER RACK · ZONE-B · LIVE
          </span>
        </div>
        {/* Fake server rows */}
        {[
          { id: "SRV-0042", temp: "62°C", status: "normal", pct: 62 },
          { id: "SRV-0101", temp: "71°C", status: "warn", pct: 71 },
          { id: "SRV-0073", temp: "88°C", status: "spike", pct: 88 },
          { id: "SRV-0155", temp: "59°C", status: "normal", pct: 59 },
          { id: "SRV-0012", temp: "65°C", status: "normal", pct: 65 },
        ].map((s) => (
          <div key={s.id} className="flex items-center gap-3 mb-3">
            <span className="text-xs w-20 shrink-0" style={{ fontFamily: "Share Tech Mono,monospace", color: "#607d8b" }}>
              {s.id}
            </span>
            <div className="flex-1 h-2 rounded-full" style={{ background: "#17243a" }}>
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${s.pct}%`,
                  background:
                    s.status === "spike" ? "#ff3d57" : s.status === "warn" ? "#ffab00" : "#00e676",
                }}
              />
            </div>
            <span className="text-xs w-12 text-right" style={{
              color: s.status === "spike" ? "#ff3d57" : s.status === "warn" ? "#ffab00" : "#00e676",
              fontFamily: "Share Tech Mono,monospace",
            }}>
              {s.temp}
            </span>
            {s.status === "spike" && (
              <span className="text-xs spike-blink" style={{ color: "#ff3d57" }}>⚠</span>
            )}
          </div>
        ))}
        {/* Alert badge */}
        <div
          className="mt-4 rounded-lg px-3 py-2 flex items-center gap-2 spike-blink"
          style={{ background: "rgba(255,61,87,0.1)", border: "1px solid rgba(255,61,87,0.3)" }}
        >
          <span style={{ color: "#ff3d57" }}>🔥</span>
          <span className="text-xs font-semibold" style={{ color: "#ff3d57", fontFamily: "Rajdhani,sans-serif", letterSpacing: "1px" }}>
            THERMAL SPIKE DETECTED — SRV-0073 · HOTSPOT 88°C
          </span>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div style={{ background: "#080d18", minHeight: "100vh" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* BG grid */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(#00e5ff 1px,transparent 1px),linear-gradient(90deg,#00e5ff 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,229,255,0.04) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.2)" }}>
              <span className="w-2 h-2 rounded-full bg-green-400 spike-blink" />
              <span className="text-xs" style={{ fontFamily: "Share Tech Mono,monospace", color: "#00e5ff" }}>
                AI MODEL ACTIVE · XGBoost v2
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight"
              style={{ fontFamily: "Rajdhani,sans-serif", color: "#dde4f0", letterSpacing: "1px" }}>
              Predict Thermal<br />
              <span style={{ color: "#00e5ff" }}>Spikes</span>{" "}
              <span style={{ color: "#ffab00" }}>Before</span><br />
              They Strike
            </h1>

            <p className="text-base leading-relaxed mb-8 max-w-lg" style={{ color: "#607d8b" }}>
              ThermalSpike is a B2B AI platform that detects dangerous server temperature spikes in real time —
              protecting your data centre from downtime, hardware damage, and data loss.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/register"
                className="px-7 py-3 rounded-lg font-bold transition-all hover:shadow-xl"
                style={{
                  background: "linear-gradient(135deg,#005f64,#007a82)",
                  border: "1px solid #00e5ff",
                  color: "#e0f7fa",
                  fontFamily: "Rajdhani,sans-serif",
                  letterSpacing: "2px",
                  fontSize: "15px",
                }}>
                GET STARTED FREE
              </Link>
              <Link to="/about"
                className="px-7 py-3 rounded-lg font-bold transition-all"
                style={{
                  border: "1px solid rgba(0,229,255,0.25)",
                  color: "#607d8b",
                  fontFamily: "Rajdhani,sans-serif",
                  letterSpacing: "2px",
                  fontSize: "15px",
                }}>
                LEARN MORE
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-4 mt-10">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-xl font-bold" style={{ fontFamily: "Share Tech Mono,monospace", color: "#00e5ff" }}>
                    {s.value}
                  </div>
                  <div className="text-xs mt-1" style={{ color: "#607d8b", fontFamily: "Rajdhani,sans-serif", letterSpacing: "1px" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <HeroAnimation />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs mb-2" style={{ fontFamily: "Share Tech Mono,monospace", color: "#00e5ff", letterSpacing: "3px" }}>
              PLATFORM CAPABILITIES
            </p>
            <h2 className="text-4xl font-bold" style={{ fontFamily: "Rajdhani,sans-serif", color: "#dde4f0" }}>
              Everything Your Data Centre Needs
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title}
                className="rounded-xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{ background: "#0f1826", border: "1px solid rgba(0,229,255,0.08)", borderTop: `3px solid ${f.color}` }}>
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "Rajdhani,sans-serif", color: "#dde4f0" }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#607d8b" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6" style={{ background: "#040810" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs mb-2" style={{ fontFamily: "Share Tech Mono,monospace", color: "#00e5ff", letterSpacing: "3px" }}>
              HOW IT WORKS
            </p>
            <h2 className="text-4xl font-bold" style={{ fontFamily: "Rajdhani,sans-serif", color: "#dde4f0" }}>
              Up and Running in Minutes
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {HOW_STEPS.map((s) => (
              <div key={s.n} className="flex gap-4 p-6 rounded-xl"
                style={{ background: "#0f1826", border: "1px solid rgba(0,229,255,0.08)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg,#005f64,#007a82)", fontFamily: "Share Tech Mono,monospace", color: "#e0f7fa", fontSize: "13px" }}>
                  {s.n}
                </div>
                <div>
                  <h4 className="font-bold mb-1" style={{ fontFamily: "Rajdhani,sans-serif", color: "#dde4f0", fontSize: "17px" }}>
                    {s.title}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: "#607d8b" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING TEASER ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs mb-2" style={{ fontFamily: "Share Tech Mono,monospace", color: "#00e5ff", letterSpacing: "3px" }}>PRICING</p>
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "Rajdhani,sans-serif", color: "#dde4f0" }}>Simple, Transparent Pricing</h2>
          <p className="mb-10" style={{ color: "#607d8b" }}>Start free. Upgrade when you need unlimited AI predictions.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <div className="rounded-xl p-7" style={{ background: "#0f1826", border: "1px solid rgba(0,229,255,0.15)" }}>
              <div className="text-2xl font-bold mb-1" style={{ fontFamily: "Rajdhani,sans-serif", color: "#dde4f0" }}>Free</div>
              <div className="text-4xl font-bold mb-4" style={{ fontFamily: "Share Tech Mono,monospace", color: "#00e5ff" }}>₹0</div>
              {["3 AI Predictions","Real-time Dashboard","Basic Insights","Google Login"].map(i => (
                <div key={i} className="flex items-center gap-2 mb-2 text-sm" style={{ color: "#607d8b" }}>
                  <span style={{ color: "#00e676" }}>✓</span> {i}
                </div>
              ))}
              <Link to="/register" className="block mt-6 py-2.5 rounded-lg text-center font-bold transition-all"
                style={{ border: "1px solid rgba(0,229,255,0.3)", color: "#00e5ff", fontFamily: "Rajdhani,sans-serif", letterSpacing: "1px" }}>
                GET STARTED
              </Link>
            </div>
            {/* Pro */}
            <div className="rounded-xl p-7 relative" style={{ background: "linear-gradient(135deg,rgba(0,229,255,0.05),rgba(0,122,130,0.05))", border: "1px solid rgba(0,229,255,0.4)" }}>
              <div className="absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: "#ffab00", color: "#080d18", fontFamily: "Rajdhani,sans-serif" }}>POPULAR</div>
              <div className="text-2xl font-bold mb-1" style={{ fontFamily: "Rajdhani,sans-serif", color: "#dde4f0" }}>Pro</div>
              <div className="text-4xl font-bold mb-4" style={{ fontFamily: "Share Tech Mono,monospace", color: "#ffab00" }}>₹999<span className="text-lg">/mo</span></div>
              {["Unlimited AI Predictions","Priority Analytics","Root Cause AI Reports","Admin Dashboard","Priority Support"].map(i => (
                <div key={i} className="flex items-center gap-2 mb-2 text-sm" style={{ color: "#a0b4c0" }}>
                  <span style={{ color: "#00e676" }}>✓</span> {i}
                </div>
              ))}
              <Link to="/register" className="block mt-6 py-2.5 rounded-lg text-center font-bold transition-all"
                style={{ background: "linear-gradient(135deg,#005f64,#007a82)", border: "1px solid #00e5ff", color: "#e0f7fa", fontFamily: "Rajdhani,sans-serif", letterSpacing: "1px" }}>
                UPGRADE WITH RAZORPAY
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(135deg,rgba(0,95,100,0.15),rgba(0,229,255,0.03))", borderTop: "1px solid rgba(0,229,255,0.08)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "Rajdhani,sans-serif", color: "#dde4f0" }}>
            Ready to Protect Your Data Centre?
          </h2>
          <p className="mb-8" style={{ color: "#607d8b" }}>
            Join hundreds of data centre operators using ThermalSpike to prevent costly thermal events.
          </p>
          <Link to="/register"
            className="inline-block px-10 py-3.5 rounded-lg font-bold text-lg transition-all hover:shadow-2xl glow-cyan"
            style={{ background: "linear-gradient(135deg,#005f64,#00a0ad)", border: "1px solid #00e5ff", color: "#e0f7fa", fontFamily: "Rajdhani,sans-serif", letterSpacing: "2px" }}>
            START FREE TODAY
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
