import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";

const modelStats = [
  { label: "MODEL", value: "XGBoost" },
  { label: "ACCURACY", value: "~95%" },
  { label: "F1 SCORE", value: "~92%" },
  { label: "INFERENCE", value: "<5ms" },
  { label: "FEATURES", value: "5,155" },
  { label: "TRAINING REC", value: "20,000" },
];

const perfData = [
  { name: "Logistic Reg", accuracy: 82, f1: 71 },
  { name: "Random Forest", accuracy: 91, f1: 86 },
  { name: "XGBoost", accuracy: 95, f1: 92 },
];

const ADMIN_NAV = [
  { id: "overview",    icon: "📋", label: "Overview" },
  { id: "datacenters", icon: "🏢", label: "Data Centres" },
  { id: "model",       icon: "🤖", label: "Model Insights" },
  { id: "messages",    icon: "✉️",  label: "Messages" },
];

export default function AdminDashboard() {
  const [page, setPage]             = useState("overview");
  const [users, setUsers]           = useState([]);
  const [messages, setMessages]     = useState([]);
  const [loadingUsers, setLoading]  = useState(false);
  const { user, userData, logout }  = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (page === "datacenters") fetchUsers();
    if (page === "messages")    fetchMessages();
  }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch { toast.error("Failed to load data centres."); }
    finally { setLoading(false); }
  };

  const fetchMessages = async () => {
    try {
      const snap = await getDocs(query(collection(db, "messages"), orderBy("createdAt", "desc")));
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch { toast.error("Failed to load messages."); }
  };

  const handleLogout = async () => { await logout(); navigate("/"); };

  return (
    <div className="flex h-screen" style={{ background: "#080d18", overflow: "hidden" }}>
      {/* Sidebar */}
      <aside className="w-64 flex flex-col shrink-0"
        style={{ background: "linear-gradient(180deg,#0b1422 0%,#080d18 100%)", borderRight: "1px solid rgba(255,171,0,0.08)" }}>
        <div className="p-5 border-b" style={{ borderColor: "rgba(255,171,0,0.08)" }}>
          <div style={{ fontFamily: "Rajdhani,sans-serif", color: "#ffab00", letterSpacing: "3px", fontSize: "16px", fontWeight: 700 }}>
            🛡️ ADMIN PANEL
          </div>
          <div style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "10px", color: "#607d8b", letterSpacing: "2px", marginTop: "3px" }}>
            THERMALSPIKE CONTROL
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {ADMIN_NAV.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
              style={{
                background: page === n.id ? "rgba(255,171,0,0.08)" : "transparent",
                border: page === n.id ? "1px solid rgba(255,171,0,0.2)" : "1px solid transparent",
                color: page === n.id ? "#ffab00" : "#607d8b",
                fontFamily: "Rajdhani,sans-serif", letterSpacing: "1.5px", fontSize: "13px",
              }}>
              <span>{n.icon}</span><span>{n.label.toUpperCase()}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t space-y-2" style={{ borderColor: "rgba(255,171,0,0.08)" }}>
          <button onClick={() => navigate("/")}
            className="w-full px-4 py-2.5 rounded-xl text-left text-sm"
            style={{ border: "1px solid rgba(0,229,255,0.1)", color: "#607d8b", fontFamily: "Rajdhani,sans-serif" }}>
            🏠 HOME
          </button>
          <button onClick={handleLogout}
            className="w-full px-4 py-2.5 rounded-xl text-left text-sm"
            style={{ border: "1px solid rgba(255,61,87,0.1)", color: "#ff3d57", fontFamily: "Rajdhani,sans-serif" }}>
            🚪 SIGN OUT
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-8">

        {/* OVERVIEW */}
        {page === "overview" && (
          <div>
            <h2 style={{ fontFamily: "Rajdhani,sans-serif", color: "#ffab00", fontSize: "28px", fontWeight: 700, letterSpacing: "2px", marginBottom: "8px" }}>
              ADMIN OVERVIEW
            </h2>
            <p style={{ color: "#607d8b", fontSize: "13px", marginBottom: "24px" }}>Platform health and usage metrics</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { v: users.length || "—", l: "REGISTERED DCs", c: "#00e5ff" },
                { v: "11", l: "TOTAL SPIKE EVENTS", c: "#ff3d57" },
                { v: "95%", l: "MODEL ACCURACY", c: "#00e676" },
                { v: "₹999", l: "PRO PLAN PRICE", c: "#ffab00" },
              ].map(k => (
                <div key={k.l} className="rounded-xl p-5 text-center"
                  style={{ background: "#0f1826", border: "1px solid rgba(255,171,0,0.08)" }}>
                  <div style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "26px", color: k.c }}>{k.v}</div>
                  <div style={{ fontSize: "10px", color: "#607d8b", fontFamily: "Rajdhani,sans-serif", letterSpacing: "1.5px", marginTop: "4px" }}>{k.l}</div>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-5" style={{ background: "#0f1826", border: "1px solid rgba(255,171,0,0.08)" }}>
              <h3 style={{ fontFamily: "Rajdhani,sans-serif", color: "#ffab00", fontSize: "13px", letterSpacing: "2px", marginBottom: "14px" }}>
                MODEL PERFORMANCE COMPARISON
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={perfData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,171,0,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: "#607d8b", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#607d8b", fontSize: 11 }} domain={[60, 100]} />
                  <Tooltip contentStyle={{ background: "#17243a", border: "1px solid rgba(255,171,0,0.2)", borderRadius: 8 }} />
                  <Bar dataKey="accuracy" fill="#00e5ff" radius={[4,4,0,0]} name="Accuracy %" />
                  <Bar dataKey="f1" fill="#ffab00" radius={[4,4,0,0]} name="F1 Score %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* DATA CENTRES */}
        {page === "datacenters" && (
          <div>
            <h2 style={{ fontFamily: "Rajdhani,sans-serif", color: "#ffab00", fontSize: "28px", fontWeight: 700, letterSpacing: "2px", marginBottom: "24px" }}>
              ALL DATA CENTRES
            </h2>
            {loadingUsers ? (
              <p style={{ color: "#607d8b" }}>Loading...</p>
            ) : (
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,171,0,0.1)" }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ background: "#17243a" }}>
                      {["Name","Email","DC Name","Zone","City","Servers","Plan","Free Left"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs"
                          style={{ color: "#607d8b", fontFamily: "Rajdhani,sans-serif", letterSpacing: "1px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => u.role !== "admin").map(u => (
                      <tr key={u.id} style={{ borderTop: "1px solid rgba(255,171,0,0.05)" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,171,0,0.02)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        {[u.displayName||"—", u.email||"—", u.datacenterName||"—", u.zone||"—", u.city||"—", u.serverCount||"—",
                          u.subscribed ? "PRO" : "FREE", u.freePredictions??0].map((v,i) => (
                          <td key={i} className="px-4 py-3 text-sm" style={{ color: "#dde4f0" }}>{v}</td>
                        ))}
                      </tr>
                    ))}
                    {users.filter(u => u.role !== "admin").length === 0 && (
                      <tr><td colSpan={8} className="px-4 py-6 text-center text-sm" style={{ color: "#607d8b" }}>No data centres registered yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* MODEL INSIGHTS */}
        {page === "model" && (
          <div>
            <h2 style={{ fontFamily: "Rajdhani,sans-serif", color: "#ffab00", fontSize: "28px", fontWeight: 700, letterSpacing: "2px", marginBottom: "24px" }}>
              MODEL INSIGHTS
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {modelStats.map(s => (
                <div key={s.label} className="rounded-xl p-5 text-center"
                  style={{ background: "#0f1826", border: "1px solid rgba(255,171,0,0.08)" }}>
                  <div style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "22px", color: "#00e5ff" }}>{s.value}</div>
                  <div style={{ fontSize: "10px", color: "#607d8b", fontFamily: "Rajdhani,sans-serif", letterSpacing: "1.5px", marginTop: "4px" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-6" style={{ background: "#0f1826", border: "1px solid rgba(255,171,0,0.08)" }}>
              <h3 style={{ fontFamily: "Rajdhani,sans-serif", color: "#ffab00", letterSpacing: "2px", marginBottom: "12px" }}>MODEL PIPELINE</h3>
              {[
                ["1","Data Ingestion","20,000 server telemetry records from a 4-zone data centre"],
                ["2","Feature Engineering","OHE on ServerID, UserID, Zone, WorkType → 5,132 binary cols + 23 numeric"],
                ["3","Train/Test Split","80/20 stratified split preserving 15% spike class ratio"],
                ["4","Model Training","XGBoost with scale_pos_weight to handle class imbalance"],
                ["5","Serialisation","ohe.pkl · scaler.pkl · Xgboost.pkl — loaded at Flask startup"],
                ["6","Inference","Single POST /api/predict → result in <5ms"],
              ].map(([n,t,d]) => (
                <div key={n} className="flex gap-4 py-4" style={{ borderBottom: "1px solid rgba(255,171,0,0.05)" }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg,#c67c00,#ffab00)", fontFamily: "Share Tech Mono,monospace", color: "#080d18", fontSize: "13px" }}>
                    {n}
                  </div>
                  <div>
                    <div style={{ fontFamily: "Rajdhani,sans-serif", color: "#dde4f0", fontSize: "16px", fontWeight: 700 }}>{t}</div>
                    <div style={{ color: "#607d8b", fontSize: "13px", marginTop: "2px" }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MESSAGES */}
        {page === "messages" && (
          <div>
            <h2 style={{ fontFamily: "Rajdhani,sans-serif", color: "#ffab00", fontSize: "28px", fontWeight: 700, letterSpacing: "2px", marginBottom: "24px" }}>
              CONTACT MESSAGES
            </h2>
            {messages.length === 0 ? (
              <p style={{ color: "#607d8b" }}>No messages yet.</p>
            ) : (
              <div className="space-y-4">
                {messages.map(m => (
                  <div key={m.id} className="rounded-xl p-5" style={{ background: "#0f1826", border: "1px solid rgba(255,171,0,0.08)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ fontFamily: "Rajdhani,sans-serif", color: "#dde4f0", fontWeight: 700 }}>{m.name} · {m.email}</span>
                      <span style={{ fontSize: "11px", color: "#607d8b" }}>{m.createdAt?.toDate?.().toLocaleDateString() || "—"}</span>
                    </div>
                    <p style={{ color: "#a0b4c0", fontSize: "14px" }}>{m.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
