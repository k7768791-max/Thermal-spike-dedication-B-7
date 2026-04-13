import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend
} from "recharts";
import { doc, updateDoc, serverTimestamp, increment } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { predictThermalSpike } from "../utils/api";
import toast from "react-hot-toast";

// ── Fake live data generator ─────────────────────────────────────────────────
const genLiveData = () => Array.from({ length: 12 }, (_, i) => ({
  time: `${String(i * 5).padStart(2, "0")}m`,
  hotspot: 55 + Math.random() * 30,
  inlet: 22 + Math.random() * 8,
  cooling: 65 + Math.random() * 20,
  power: 400 + Math.random() * 600,
}));

const ZONE_DATA = [
  { zone: "Zone-A", servers: 50, spikes: 2, safe: 48 },
  { zone: "Zone-B", servers: 50, spikes: 5, safe: 45 },
  { zone: "Zone-C", servers: 50, spikes: 1, safe: 49 },
  { zone: "Zone-D", servers: 50, spikes: 3, safe: 47 },
];

const INPUT_DEFAULTS = {
  ServerID: "SRV-0042", UserID: "USR-00001", DataCentreZone: "Zone-A",
  WorkType: "inference", Timestamp: new Date().toISOString(),
  user_session_duration_s: 3050, user_request_count: 1046,
  user_payload_size_mb: 206, user_cpu_cores_used: 33,
  user_gpu_memory_used_gb: 18, user_ram_used_gb: 85,
  user_disk_io_mbps: 270, user_power_draw_w: 480,
  user_cpu_contribution_pct: 25.8, user_gpu_contribution_pct: 22.5,
  user_heat_contribution_pct: 9.6, inlet_temp_c: 25.5,
  outlet_temp_c: 41.6, hotspot_temp_c: 62.2,
  cooling_capacity_pct: 71.8, airflow_rate_cfm: 2606,
  ambient_temp_c: 24.7, humidity_pct: 50.1,
  rolling_avg_temp_15m_c: 62.2,
};
const WORK_TYPES = ["analytics","batch","data-pipeline","ETL","inference","ML-training","stream","web"];
const ZONES      = ["Zone-A","Zone-B","Zone-C","Zone-D"];

// ── Sidebar nav ──────────────────────────────────────────────────────────────
const NAV = [
  { id: "insights",   icon: "📊", label: "Insights" },
  { id: "ai",        icon: "🤖", label: "AI Analysis" },
  { id: "profile",   icon: "👤", label: "Profile" },
];

// ─────────────────────────────────────────────────────────────────────────────
//  INSIGHTS PAGE
// ─────────────────────────────────────────────────────────────────────────────
function InsightsPage({ userData }) {
  const [liveData, setLiveData] = useState(genLiveData());

  useEffect(() => {
    const id = setInterval(() => setLiveData(genLiveData()), 5000);
    return () => clearInterval(id);
  }, []);

  const kpis = [
    { label: "SERVERS ONLINE",   value: userData?.serverCount || 50,   color: "#00e5ff" },
    { label: "ZONE",              value: userData?.zone || "Zone-A",    color: "#ffab00" },
    { label: "SPIKE EVENTS TODAY",value: "3",                           color: "#ff3d57" },
    { label: "AVG HOTSPOT",       value: "64°C",                       color: "#00e676" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 style={{ fontFamily: "Rajdhani,sans-serif", color: "#00e5ff", fontSize: "28px", fontWeight: 700, letterSpacing: "2px" }}>
          LIVE INSIGHTS
        </h2>
        <p style={{ color: "#607d8b", fontSize: "13px" }}>
          Real-time thermal telemetry for <strong style={{ color: "#dde4f0" }}>{userData?.datacenterName || "Your Data Centre"}</strong>
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map(k => (
          <div key={k.label} className="rounded-xl p-5 text-center"
            style={{ background: "#0f1826", border: "1px solid rgba(0,229,255,0.08)" }}>
            <div style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "26px", color: k.color }}>{k.value}</div>
            <div style={{ fontSize: "10px", color: "#607d8b", fontFamily: "Rajdhani,sans-serif", letterSpacing: "1.5px", marginTop: "4px" }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Line chart – hotspot over time */}
      <div className="rounded-xl p-5 mb-6" style={{ background: "#0f1826", border: "1px solid rgba(0,229,255,0.08)" }}>
        <h3 style={{ fontFamily: "Rajdhani,sans-serif", color: "#ffab00", fontSize: "14px", letterSpacing: "2px", marginBottom: "14px" }}>
          HOTSPOT TEMP · LAST 60 MIN
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={liveData}>
            <defs>
              <linearGradient id="hotGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff3d57" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ff3d57" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,255,0.05)" />
            <XAxis dataKey="time" tick={{ fill: "#607d8b", fontSize: 11 }} />
            <YAxis tick={{ fill: "#607d8b", fontSize: 11 }} domain={[40, 95]} />
            <Tooltip contentStyle={{ background: "#17243a", border: "1px solid rgba(0,229,255,0.2)", borderRadius: 8 }} labelStyle={{ color: "#dde4f0" }} />
            <Area type="monotone" dataKey="hotspot" stroke="#ff3d57" fill="url(#hotGrad)" strokeWidth={2} name="Hotspot°C" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bar chart – power draw */}
        <div className="rounded-xl p-5" style={{ background: "#0f1826", border: "1px solid rgba(0,229,255,0.08)" }}>
          <h3 style={{ fontFamily: "Rajdhani,sans-serif", color: "#ffab00", fontSize: "13px", letterSpacing: "2px", marginBottom: "14px" }}>
            POWER DRAW (W) · PER INTERVAL
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={liveData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,255,0.05)" />
              <XAxis dataKey="time" tick={{ fill: "#607d8b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#607d8b", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#17243a", border: "1px solid rgba(0,229,255,0.2)", borderRadius: 8 }} />
              <Bar dataKey="power" fill="#00e5ff" radius={[4,4,0,0]} name="Power W" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart – zone spike distribution */}
        <div className="rounded-xl p-5" style={{ background: "#0f1826", border: "1px solid rgba(0,229,255,0.08)" }}>
          <h3 style={{ fontFamily: "Rajdhani,sans-serif", color: "#ffab00", fontSize: "13px", letterSpacing: "2px", marginBottom: "14px" }}>
            SPIKE DISTRIBUTION BY ZONE
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={ZONE_DATA} dataKey="spikes" nameKey="zone" cx="50%" cy="50%" outerRadius={70}>
                {ZONE_DATA.map((_, i) => (
                  <Cell key={i} fill={["#00e5ff","#ffab00","#ff3d57","#00e676"][i]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ color: "#607d8b", fontSize: "12px" }} />
              <Tooltip contentStyle={{ background: "#17243a", border: "1px solid rgba(0,229,255,0.2)", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cooling capacity line */}
      <div className="rounded-xl p-5" style={{ background: "#0f1826", border: "1px solid rgba(0,229,255,0.08)" }}>
        <h3 style={{ fontFamily: "Rajdhani,sans-serif", color: "#ffab00", fontSize: "13px", letterSpacing: "2px", marginBottom: "14px" }}>
          COOLING CAPACITY (%) vs INLET TEMP (°C)
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={liveData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,255,0.05)" />
            <XAxis dataKey="time" tick={{ fill: "#607d8b", fontSize: 11 }} />
            <YAxis tick={{ fill: "#607d8b", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#17243a", border: "1px solid rgba(0,229,255,0.2)", borderRadius: 8 }} />
            <Line type="monotone" dataKey="cooling" stroke="#00e676" strokeWidth={2} dot={false} name="Cooling %" />
            <Line type="monotone" dataKey="inlet"   stroke="#ffab00" strokeWidth={2} dot={false} name="Inlet°C" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  AI ANALYSIS PAGE
// ─────────────────────────────────────────────────────────────────────────────
function AIAnalysisPage({ userData, user, onPrediction }) {
  const [form, setForm]         = useState(INPUT_DEFAULTS);
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const { decrementFreeCount }  = useAuth();

  const free = userData?.freePredictions ?? 0;
  const subscribed = userData?.subscribed ?? false;
  const canPredict = subscribed || free > 0;

  // ── Safe handler: strings stay strings, numbers stay numbers ─────────────
  const handle = (k) => (e) => {
    const raw = e.target.value;
    // For numeric inputs, keep as number; for text/select keep as string
    const val = e.target.type === "number" ? (raw === "" ? "" : parseFloat(raw)) : raw;
    setForm(p => ({ ...p, [k]: val }));
  };

  const handlePredict = async () => {
    console.log("🟡 [PREDICT] Button clicked");
    console.log("🟡 [PREDICT] canPredict:", canPredict, "| free:", free, "| subscribed:", subscribed);

    if (!canPredict) {
      console.log("🔴 [PREDICT] No predictions left — showing paywall");
      setShowPayment(true);
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form, Timestamp: new Date().toISOString() };
      console.log("🟢 [PREDICT] Sending payload to Flask API:", payload);

      const res = await predictThermalSpike(payload);
      console.log("🟢 [PREDICT] API response received:", res);

      setResult(res);
      if (!subscribed) await decrementFreeCount(user.uid);
      toast.success("Prediction complete!");
    } catch (err) {
      console.error("🔴 [PREDICT] API call failed:", err);
      console.error("🔴 [PREDICT] Error details:", err?.response?.data || err?.message || err);
      toast.error(
        err?.response?.data?.error
          ? `Backend error: ${err.response.data.error}`
          : "Prediction failed — check console & confirm Flask is running on port 5000"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpay = () => {
    // Razorpay integration placeholder
    const options = {
      key: "rzp_test_RqzWeEJxvsKy4n",
      amount: 99900, // ₹999 in paise
      currency: "INR",
      name: "ThermalSpike AI",
      description: "Pro Subscription – Unlimited Predictions",
      handler: async function() {
        await updateDoc(doc(db, "users", user.uid), { subscribed: true, freePredictions: 9999 });
        toast.success("🎉 Subscription activated!");
        setShowPayment(false);
        window.location.reload();
      },
      prefill: { email: user?.email || "", name: user?.displayName || "" },
      theme: { color: "#00e5ff" },
    };
    if (window.Razorpay) {
      const rp = new window.Razorpay(options);
      rp.open();
    } else {
      toast.error("Razorpay not loaded. Add script tag to index.html.");
    }
  };

  const inputCls = { background: "#17243a", border: "1px solid rgba(0,229,255,0.15)", color: "#dde4f0", borderRadius: "8px", padding: "8px 12px", width: "100%", fontSize: "13px" };
  const labelCls = { fontSize: "10px", color: "#607d8b", letterSpacing: "1.5px", fontFamily: "Rajdhani,sans-serif", fontWeight: 700, display: "block", marginBottom: "4px" };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 style={{ fontFamily: "Rajdhani,sans-serif", color: "#00e5ff", fontSize: "28px", fontWeight: 700, letterSpacing: "2px" }}>
            AI ANALYSIS
          </h2>
          <p style={{ color: "#607d8b", fontSize: "13px" }}>XGBoost thermal spike predictor</p>
        </div>
        {/* Free count badge */}
        <div className="px-4 py-2 rounded-xl text-sm"
          style={{ background: "#0f1826", border: "1px solid rgba(0,229,255,0.12)" }}>
          {subscribed
            ? <span style={{ color: "#00e676", fontFamily: "Rajdhani,sans-serif" }}>✅ PRO – UNLIMITED</span>
            : <span style={{ color: free > 0 ? "#ffab00" : "#ff3d57", fontFamily: "Rajdhani,sans-serif" }}>
                🎁 {free} FREE PREDICTION{free !== 1 ? "S" : ""} LEFT
              </span>
          }
        </div>
      </div>

      {/* Paywall modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="rounded-2xl p-8 max-w-sm w-full mx-4" style={{ background: "#0f1826", border: "1px solid rgba(0,229,255,0.2)" }}>
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🔒</div>
              <h3 style={{ fontFamily: "Rajdhani,sans-serif", color: "#dde4f0", fontSize: "22px" }}>Free Predictions Used</h3>
              <p style={{ color: "#607d8b", fontSize: "13px", marginTop: "8px" }}>
                Upgrade to Pro for unlimited AI predictions — just ₹999/month.
              </p>
            </div>
            <button onClick={handleRazorpay}
              className="w-full py-3 rounded-xl font-bold mb-3"
              style={{ background: "linear-gradient(135deg,#005f64,#007a82)", border: "1px solid #00e5ff", color: "#e0f7fa", fontFamily: "Rajdhani,sans-serif", letterSpacing: "2px" }}>
              PAY ₹999/MO WITH RAZORPAY
            </button>
            <button onClick={() => setShowPayment(false)}
              className="w-full py-3 rounded-xl font-bold"
              style={{ border: "1px solid rgba(0,229,255,0.15)", color: "#607d8b", fontFamily: "Rajdhani,sans-serif" }}>
              CANCEL
            </button>
          </div>
        </div>
      )}

      {/* Input form */}
      <div className="rounded-xl p-6 mb-6" style={{ background: "#0f1826", border: "1px solid rgba(0,229,255,0.08)" }}>
        <h3 style={{ fontFamily: "Rajdhani,sans-serif", color: "#607d8b", fontSize: "11px", letterSpacing: "2px", marginBottom: "16px" }}>
          🖥️ SERVER IDENTITY
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[["ServerID","Server ID","text"],["UserID","User ID","text"]].map(([k,l,t]) => (
            <div key={k}><label style={labelCls}>{l}</label>
              <input style={inputCls} value={form[k]} onChange={e => setForm(p => ({...p,[k]:e.target.value}))} /></div>
          ))}
          <div><label style={labelCls}>DC ZONE</label>
            <select style={inputCls} value={form.DataCentreZone} onChange={e => setForm(p => ({...p, DataCentreZone: e.target.value}))}>
              {ZONES.map(z => <option key={z}>{z}</option>)}
            </select>
          </div>
          <div><label style={labelCls}>WORK TYPE</label>
            <select style={inputCls} value={form.WorkType} onChange={e => setForm(p => ({...p, WorkType: e.target.value}))}>
              {WORK_TYPES.map(w => <option key={w}>{w}</option>)}
            </select>
          </div>
        </div>

        <h3 style={{ fontFamily: "Rajdhani,sans-serif", color: "#607d8b", fontSize: "11px", letterSpacing: "2px", marginBottom: "16px" }}>
          ⚙️ WORKLOAD METRICS
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            ["user_session_duration_s","Session Dur (s)"],["user_request_count","Request Count"],
            ["user_payload_size_mb","Payload MB"],["user_cpu_cores_used","CPU Cores"],
            ["user_gpu_memory_used_gb","GPU Mem GB"],["user_ram_used_gb","RAM GB"],
            ["user_disk_io_mbps","Disk IO MBps"],["user_power_draw_w","Power Draw W"],
          ].map(([k,l]) => (
            <div key={k}><label style={labelCls}>{l}</label>
              <input style={inputCls} type="number" value={form[k]} onChange={handle(k)} /></div>
          ))}
        </div>

        <h3 style={{ fontFamily: "Rajdhani,sans-serif", color: "#607d8b", fontSize: "11px", letterSpacing: "2px", marginBottom: "16px" }}>
          🌡️ THERMAL & ENVIRONMENTAL
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            ["inlet_temp_c","Inlet°C"],["outlet_temp_c","Outlet°C"],
            ["hotspot_temp_c","Hotspot°C"],["cooling_capacity_pct","Cooling %"],
            ["airflow_rate_cfm","Airflow CFM"],["ambient_temp_c","Ambient°C"],
            ["humidity_pct","Humidity %"],["rolling_avg_temp_15m_c","Rolling Avg°C"],
          ].map(([k,l]) => (
            <div key={k}><label style={labelCls}>{l}</label>
              <input style={inputCls} type="number" value={form[k]} onChange={handle(k)} step="0.1" /></div>
          ))}
        </div>

        <div className="text-center mt-4">
          <button onClick={handlePredict} disabled={loading}
            className="px-10 py-3 rounded-xl font-bold text-lg transition-all disabled:opacity-50"
            style={{
              background: loading ? "#17243a" : "linear-gradient(135deg,#005f64,#007a82)",
              border: "1px solid #00e5ff", color: "#e0f7fa",
              fontFamily: "Rajdhani,sans-serif", letterSpacing: "2px",
            }}>
            {loading ? "ANALYSING..." : "⚡ RUN PREDICTION"}
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="rounded-xl p-6"
          style={{
            background: result.is_spike ? "rgba(255,61,87,0.05)" : "rgba(0,230,118,0.05)",
            border: `1px solid ${result.is_spike ? "rgba(255,61,87,0.3)" : "rgba(0,230,118,0.3)"}`,
          }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">{result.is_spike ? "⚠️" : "✅"}</div>
            <div>
              <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "24px", fontWeight: 700, color: result.is_spike ? "#ff3d57" : "#00e676", letterSpacing: "2px" }}>
                {result.is_spike ? "THERMAL SPIKE DETECTED" : "NORMAL OPERATION"}
              </div>
              <div style={{ color: "#607d8b", fontSize: "13px" }}>
                {result.server_id} · {result.zone} · Risk: <strong style={{ color: result.is_spike ? "#ff3d57" : "#00e676" }}>{result.risk_band}</strong>
              </div>
            </div>
            <div className="ml-auto text-right">
              <div style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "32px", color: result.is_spike ? "#ff3d57" : "#00e676" }}>
                {result.spike_probability}%
              </div>
              <div style={{ color: "#607d8b", fontSize: "11px" }}>SPIKE PROBABILITY</div>
            </div>
          </div>

          {result.is_spike && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="rounded-xl p-4" style={{ background: "rgba(255,61,87,0.08)", border: "1px solid rgba(255,61,87,0.2)" }}>
                <h4 style={{ fontFamily: "Rajdhani,sans-serif", color: "#ff3d57", letterSpacing: "1px", marginBottom: "10px" }}>🔥 IDENTIFIED CAUSES</h4>
                <ul style={{ paddingLeft: "16px" }}>
                  {result.causes.map((c,i) => <li key={i} style={{ color: "#ef9a9a", fontSize: "13px", marginBottom: "6px" }}>{c}</li>)}
                </ul>
              </div>
              <div className="rounded-xl p-4" style={{ background: "rgba(0,230,118,0.08)", border: "1px solid rgba(0,230,118,0.2)" }}>
                <h4 style={{ fontFamily: "Rajdhani,sans-serif", color: "#00e676", letterSpacing: "1px", marginBottom: "10px" }}>🛠️ SUGGESTED SOLUTIONS</h4>
                <ul style={{ paddingLeft: "16px" }}>
                  {result.solutions.map((s,i) => <li key={i} style={{ color: "#a5d6a7", fontSize: "13px", marginBottom: "6px" }}>{s}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  PROFILE PAGE
// ─────────────────────────────────────────────────────────────────────────────
function ProfilePage({ user, userData }) {
  return (
    <div className="max-w-2xl">
      <h2 style={{ fontFamily: "Rajdhani,sans-serif", color: "#00e5ff", fontSize: "28px", fontWeight: 700, letterSpacing: "2px", marginBottom: "24px" }}>
        DIGITAL PROFILE
      </h2>
      <div className="rounded-2xl p-6 mb-6" style={{ background: "#0f1826", border: "1px solid rgba(0,229,255,0.12)" }}>
        <div className="flex items-center gap-4 mb-6">
          {user?.photoURL
            ? <img src={user.photoURL} alt="" className="w-16 h-16 rounded-full" style={{ border: "2px solid rgba(0,229,255,0.3)" }} />
            : <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{ background: "#17243a", border: "2px solid rgba(0,229,255,0.3)" }}>👤</div>
          }
          <div>
            <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "22px", fontWeight: 700, color: "#dde4f0" }}>{user?.displayName}</div>
            <div style={{ color: "#607d8b", fontSize: "13px" }}>{user?.email}</div>
            <div className="mt-1 px-2 py-0.5 rounded inline-block text-xs"
              style={{ background: userData?.subscribed ? "rgba(0,230,118,0.1)" : "rgba(0,229,255,0.1)", color: userData?.subscribed ? "#00e676" : "#00e5ff", fontFamily: "Rajdhani,sans-serif" }}>
              {userData?.subscribed ? "✅ PRO MEMBER" : "FREE PLAN"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            ["Data Centre", userData?.datacenterName || "—"],
            ["Zone", userData?.zone || "—"],
            ["City", userData?.city || "—"],
            ["Servers", userData?.serverCount || "—"],
            ["Free Predictions", userData?.freePredictions ?? "—"],
            ["Role", userData?.role || "datacenter"],
          ].map(([k,v]) => (
            <div key={k} className="p-4 rounded-xl" style={{ background: "#17243a" }}>
              <div style={{ fontSize: "10px", color: "#607d8b", letterSpacing: "1.5px", fontFamily: "Rajdhani,sans-serif" }}>{k.toUpperCase()}</div>
              <div style={{ color: "#dde4f0", fontSize: "15px", fontWeight: 600, marginTop: "4px", fontFamily: "Share Tech Mono,monospace" }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export default function DataCenterDashboard() {
  const [activePage, setActivePage] = useState("insights");
  const { user, userData, logout }  = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate("/"); };

  return (
    <div className="flex h-screen" style={{ background: "#080d18", overflow: "hidden" }}>
      {/* ── Sidebar ── */}
      <aside className="w-64 flex flex-col shrink-0"
        style={{ background: "linear-gradient(180deg,#0b1422 0%,#080d18 100%)", borderRight: "1px solid rgba(0,229,255,0.08)" }}>
        {/* Logo */}
        <div className="p-5 border-b" style={{ borderColor: "rgba(0,229,255,0.08)" }}>
          <div style={{ fontFamily: "Rajdhani,sans-serif", color: "#00e5ff", letterSpacing: "3px", fontSize: "18px", fontWeight: 700 }}>
            🌡️ THERMAL<span style={{ color: "#ffab00" }}>SPIKE</span>
          </div>
          <div style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "10px", color: "#607d8b", letterSpacing: "2px", marginTop: "3px" }}>
            DATA CENTRE PORTAL
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setActivePage(n.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
              style={{
                background: activePage === n.id ? "rgba(0,229,255,0.08)" : "transparent",
                border: activePage === n.id ? "1px solid rgba(0,229,255,0.15)" : "1px solid transparent",
                color: activePage === n.id ? "#00e5ff" : "#607d8b",
                fontFamily: "Rajdhani,sans-serif",
                letterSpacing: "1.5px",
                fontSize: "14px",
                fontWeight: activePage === n.id ? 700 : 400,
              }}>
              <span>{n.icon}</span>
              <span>{n.label.toUpperCase()}</span>
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t space-y-2" style={{ borderColor: "rgba(0,229,255,0.08)" }}>
          <button onClick={() => navigate("/")}
            className="w-full px-4 py-2.5 rounded-xl text-left text-sm"
            style={{ border: "1px solid rgba(0,229,255,0.1)", color: "#607d8b", fontFamily: "Rajdhani,sans-serif", letterSpacing: "1px" }}>
            🏠 BACK TO HOME
          </button>
          <button onClick={handleLogout}
            className="w-full px-4 py-2.5 rounded-xl text-left text-sm"
            style={{ border: "1px solid rgba(255,61,87,0.1)", color: "#ff3d57", fontFamily: "Rajdhani,sans-serif", letterSpacing: "1px" }}>
            🚪 SIGN OUT
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto p-8">
        {activePage === "insights"  && <InsightsPage userData={userData} />}
        {activePage === "ai"        && <AIAnalysisPage userData={userData} user={user} />}
        {activePage === "profile"   && <ProfilePage user={user} userData={userData} />}
      </main>
    </div>
  );
}
