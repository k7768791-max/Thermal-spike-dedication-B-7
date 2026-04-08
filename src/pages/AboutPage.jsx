import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TIMELINE = [
  { year: "2023 Q1", title: "Problem Identified", desc: "Data centre operators reported rising hardware failures due to undetected thermal spikes." },
  { year: "2023 Q3", title: "Dataset Built", desc: "20,000 server telemetry records collected across 4 DC zones, 200 servers, and 8 workload types." },
  { year: "2024 Q1", title: "Model Trained", desc: "XGBoost classifier trained on 5,155 features, achieving 95% accuracy and 92% F1-score on spike class." },
  { year: "2024 Q3", title: "Platform Launch", desc: "ThermalSpike B2B SaaS platform launched with Firebase auth, real-time dashboards, and Razorpay subscriptions." },
  { year: "2025",    title: "Scale & Grow",  desc: "Expanding to 500+ data centres across India, adding multi-server batch prediction and alerting APIs." },
];

const TEAM = [
  { name: "Batch 7 Team",   role: "ML Engineers",        icon: "🤖" },
  { name: "XGBoost Model",  role: "Core AI Engine",      icon: "⚡" },
  { name: "Firebase",       role: "Auth & Database",     icon: "🔥" },
  { name: "Razorpay",       role: "Payment Gateway",     icon: "💳" },
];

const MISSION_POINTS = [
  { icon: "🎯", title: "Our Mission", desc: "Eliminate data centre thermal downtime through proactive AI prediction — giving operators the 5-minute warning they need to act before a spike escalates." },
  { icon: "🔬", title: "Our Approach", desc: "We combine 24 real-time sensor signals with a trained XGBoost model to deliver binary spike risk predictions in under 5ms, at scale." },
  { icon: "🌍", title: "Our Vision", desc: "A world where no data centre loses hardware or revenue to a preventable thermal event. Starting with Hyderabad, expanding across India." },
];

export default function AboutPage() {
  return (
    <div style={{ background: "#080d18", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-6 text-center relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 20%, rgba(0,229,255,0.04) 0%, transparent 60%)" }} />
        <p className="text-xs mb-2" style={{ fontFamily: "Share Tech Mono,monospace", color: "#00e5ff", letterSpacing: "3px" }}>
          ABOUT THERMALSPIKE
        </p>
        <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "Rajdhani,sans-serif", color: "#dde4f0" }}>
          Protecting Data Centres<br />
          <span style={{ color: "#00e5ff" }}>with Artificial Intelligence</span>
        </h1>
        <p className="max-w-2xl mx-auto text-base leading-relaxed" style={{ color: "#607d8b" }}>
          ThermalSpike is a B2B AI SaaS platform built by students at Batch 7 to solve a real-world
          data centre problem — predicting dangerous thermal spikes before they cause hardware damage,
          downtime, or data loss.
        </p>
      </section>

      {/* Mission */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MISSION_POINTS.map(m => (
              <div key={m.title} className="rounded-xl p-6"
                style={{ background: "#0f1826", border: "1px solid rgba(0,229,255,0.08)" }}>
                <div className="text-4xl mb-4">{m.icon}</div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "Rajdhani,sans-serif", color: "#dde4f0" }}>{m.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#607d8b" }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Domain detail */}
      <section className="py-20 px-6" style={{ background: "#040810" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs mb-2" style={{ fontFamily: "Share Tech Mono,monospace", color: "#00e5ff", letterSpacing: "3px" }}>THE DOMAIN</p>
            <h2 className="text-4xl font-bold" style={{ fontFamily: "Rajdhani,sans-serif", color: "#dde4f0" }}>
              Why Thermal Spikes Matter
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#607d8b" }}>
                Modern hyperscale data centres house thousands of servers generating enormous heat loads.
                A <strong style={{ color: "#dde4f0" }}>thermal spike</strong> — a sudden hotspot temperature rise above 85°C —
                can trigger CPU throttling, emergency shutdowns, and permanent hardware damage in seconds.
              </p>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#607d8b" }}>
                Traditional threshold-based monitoring alerts operators <em>after</em> the spike occurs.
                By then, damage is done. ThermalSpike predicts spikes <strong style={{ color: "#00e5ff" }}>before</strong> they happen,
                giving cooling systems and operators a 5-minute intervention window.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#607d8b" }}>
                Our XGBoost model reads 24 sensor signals — covering workload intensity, rack temperatures,
                cooling efficiency, and environmental conditions — and returns a binary spike risk prediction
                with probability in under 5ms.
              </p>
            </div>
            <div className="space-y-3">
              {[
                ["⚡ Spike Detection", "XGBoost classifier, 5,155 features, 95% accuracy"],
                ["📊 Dataset", "20,000 records · 200 servers · 4 zones · 8 work types"],
                ["🌡️ Sensor Signals", "24 real-time signals per prediction"],
                ["🔒 Auth", "Firebase Google SSO, role-based access"],
                ["💳 Billing", "Razorpay subscription, 3 free predictions"],
                ["🏢 Multi-zone", "Zone-A through Zone-D independent monitoring"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ background: "#0f1826", border: "1px solid rgba(0,229,255,0.06)" }}>
                  <span style={{ color: "#00e5ff", minWidth: "130px", fontFamily: "Rajdhani,sans-serif", fontSize: "13px", fontWeight: 700 }}>{k}</span>
                  <span style={{ color: "#607d8b", fontSize: "13px" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs mb-2" style={{ fontFamily: "Share Tech Mono,monospace", color: "#00e5ff", letterSpacing: "3px" }}>PROJECT TIMELINE</p>
            <h2 className="text-4xl font-bold" style={{ fontFamily: "Rajdhani,sans-serif", color: "#dde4f0" }}>How We Got Here</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px" style={{ background: "rgba(0,229,255,0.15)" }} />
            {TIMELINE.map((t, i) => (
              <div key={i} className="flex gap-6 mb-10 relative">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10"
                  style={{ background: "linear-gradient(135deg,#005f64,#007a82)", border: "2px solid rgba(0,229,255,0.3)" }}>
                  <span style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "10px", color: "#e0f7fa" }}>{i + 1}</span>
                </div>
                <div className="pt-2">
                  <div style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "11px", color: "#00e5ff", letterSpacing: "2px", marginBottom: "4px" }}>{t.year}</div>
                  <h4 style={{ fontFamily: "Rajdhani,sans-serif", color: "#dde4f0", fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>{t.title}</h4>
                  <p style={{ color: "#607d8b", fontSize: "13px", lineHeight: "1.7" }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-20 px-6" style={{ background: "#040810" }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs mb-2" style={{ fontFamily: "Share Tech Mono,monospace", color: "#00e5ff", letterSpacing: "3px" }}>TECH STACK</p>
          <h2 className="text-4xl font-bold mb-10" style={{ fontFamily: "Rajdhani,sans-serif", color: "#dde4f0" }}>Built With Modern Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              ["⚛️", "React.js", "Frontend UI"],
              ["🔥", "Firebase", "Auth + Database"],
              ["🎨", "Tailwind CSS", "Styling"],
              ["🐍", "Python + Flask", "Backend API"],
              ["⚡", "XGBoost", "ML Model"],
              ["💳", "Razorpay", "Payments"],
              ["📊", "Recharts", "Data Viz"],
              ["🚀", "Vercel / Railway", "Deployment"],
            ].map(([icon, name, role]) => (
              <div key={name} className="rounded-xl p-5"
                style={{ background: "#0f1826", border: "1px solid rgba(0,229,255,0.08)" }}>
                <div className="text-3xl mb-2">{icon}</div>
                <div style={{ fontFamily: "Rajdhani,sans-serif", color: "#dde4f0", fontSize: "15px", fontWeight: 700 }}>{name}</div>
                <div style={{ color: "#607d8b", fontSize: "12px" }}>{role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
