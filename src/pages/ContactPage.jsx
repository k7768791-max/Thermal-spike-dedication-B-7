import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";

const FAQS = [
  { q: "What is ThermalSpike?", a: "ThermalSpike is an AI-powered B2B SaaS platform that predicts dangerous server thermal spikes in real time using an XGBoost machine learning model trained on 20,000 data centre telemetry records." },
  { q: "How accurate is the model?", a: "Our XGBoost model achieves ~95% accuracy and ~92% F1-score on the spike minority class on a 20% hold-out test set. Inference takes under 5ms per prediction." },
  { q: "How many free predictions do I get?", a: "Every registered data centre gets 3 free AI predictions. After that, upgrade to Pro (₹999/month) for unlimited predictions via Razorpay." },
  { q: "What data do I need to provide?", a: "You provide 24 server telemetry inputs: session duration, request count, CPU/GPU/RAM usage, power draw, inlet/outlet/hotspot temperatures, cooling capacity, airflow rate, ambient temperature, and humidity." },
  { q: "Is my data secure?", a: "Yes. We use Firebase with Google authentication. All data is encrypted at rest and in transit. We never share your data centre telemetry with third parties." },
  { q: "Can I integrate via API?", a: "Yes. The backend exposes a single Flask REST endpoint POST /api/predict. You can integrate it directly into your monitoring pipeline. Contact us for API key access." },
];

export default function ContactPage() {
  const [form, setForm]       = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handle = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error("Please fill all required fields."); return; }
    setSending(true);
    try {
      await addDoc(collection(db, "messages"), { ...form, createdAt: serverTimestamp() });
      toast.success("Message sent! We'll reply within 24 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "8px",
    background: "#17243a", border: "1px solid rgba(0,229,255,0.15)",
    color: "#dde4f0", fontSize: "14px", outline: "none", fontFamily: "Inter,sans-serif",
  };
  const labelStyle = {
    display: "block", marginBottom: "6px", fontSize: "11px", letterSpacing: "1.5px",
    color: "#607d8b", fontFamily: "Rajdhani,sans-serif", fontWeight: 700,
  };

  return (
    <div style={{ background: "#080d18", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-12 px-6 text-center">
        <p className="text-xs mb-2" style={{ fontFamily: "Share Tech Mono,monospace", color: "#00e5ff", letterSpacing: "3px" }}>GET IN TOUCH</p>
        <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "Rajdhani,sans-serif", color: "#dde4f0" }}>Contact Us</h1>
        <p className="max-w-xl mx-auto" style={{ color: "#607d8b" }}>
          Have a question about ThermalSpike? Want to schedule a demo? Reach out and our team will respond within 24 hours.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        {/* Contact info + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Info cards */}
          <div className="space-y-4">
            {[
              { icon: "📍", title: "Office", val: "Hyderabad, Telangana, India — 500081" },
              { icon: "📧", title: "Email", val: "support@thermalspike.ai" },
              { icon: "📞", title: "Phone", val: "+91 40 1234 5678" },
              { icon: "🕐", title: "Hours", val: "Mon–Sat, 9:00 AM – 6:00 PM IST" },
            ].map(c => (
              <div key={c.title} className="flex items-start gap-4 p-5 rounded-xl"
                style={{ background: "#0f1826", border: "1px solid rgba(0,229,255,0.08)" }}>
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <div style={{ fontFamily: "Rajdhani,sans-serif", color: "#00e5ff", fontSize: "13px", letterSpacing: "1.5px", fontWeight: 700 }}>{c.title.toUpperCase()}</div>
                  <div style={{ color: "#dde4f0", fontSize: "14px", marginTop: "2px" }}>{c.val}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Map iframe – Hyderabad */}
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,229,255,0.12)", minHeight: "340px" }}>
            <iframe
              title="ThermalSpike Hyderabad Office"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647.31698022!2d78.24323045!3d17.4123487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%" height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)", minHeight: "340px" }}
              allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Message form + FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Message form */}
          <div className="rounded-xl p-6" style={{ background: "#0f1826", border: "1px solid rgba(0,229,255,0.08)" }}>
            <h2 style={{ fontFamily: "Rajdhani,sans-serif", color: "#00e5ff", fontSize: "20px", letterSpacing: "2px", marginBottom: "20px" }}>
              ✉️ SEND A MESSAGE
            </h2>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>NAME *</label>
                  <input style={inputStyle} value={form.name} onChange={handle("name")} placeholder="Your name" required />
                </div>
                <div>
                  <label style={labelStyle}>EMAIL *</label>
                  <input style={inputStyle} type="email" value={form.email} onChange={handle("email")} placeholder="you@example.com" required />
                </div>
              </div>
              <div>
                <label style={labelStyle}>SUBJECT</label>
                <input style={inputStyle} value={form.subject} onChange={handle("subject")} placeholder="How can we help?" />
              </div>
              <div>
                <label style={labelStyle}>MESSAGE *</label>
                <textarea style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
                  value={form.message} onChange={handle("message")} placeholder="Tell us about your data centre or question..." required />
              </div>
              <button type="submit" disabled={sending}
                className="w-full py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                style={{
                  background: sending ? "#17243a" : "linear-gradient(135deg,#005f64,#007a82)",
                  border: "1px solid #00e5ff", color: "#e0f7fa",
                  fontFamily: "Rajdhani,sans-serif", letterSpacing: "2px", fontSize: "15px",
                }}>
                {sending ? "SENDING..." : "SEND MESSAGE"}
              </button>
            </form>
          </div>

          {/* FAQ */}
          <div>
            <h2 style={{ fontFamily: "Rajdhani,sans-serif", color: "#00e5ff", fontSize: "20px", letterSpacing: "2px", marginBottom: "20px" }}>
              ❓ FREQUENTLY ASKED QUESTIONS
            </h2>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="rounded-xl overflow-hidden"
                  style={{ background: "#0f1826", border: "1px solid rgba(0,229,255,0.08)" }}>
                  <button
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ fontFamily: "Rajdhani,sans-serif", color: "#dde4f0", fontSize: "14px", fontWeight: 700, letterSpacing: "0.5px" }}>
                    {faq.q}
                    <span style={{ color: "#00e5ff", fontSize: "18px", transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4" style={{ color: "#607d8b", fontSize: "13px", lineHeight: "1.7" }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
