import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

const ZONES = ["Zone-A", "Zone-B", "Zone-C", "Zone-D"];
const CITIES = ["Hyderabad", "Bangalore", "Mumbai", "Delhi", "Chennai", "Pune"];

export default function RegisterPage() {
  const { user, fetchUserData } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    datacenterName: "",
    city: "Hyderabad",
    zone: "Zone-A",
    serverCount: "",
    contactPhone: "",
  });
  const [saving, setSaving] = useState(false);

  const handle = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.datacenterName.trim()) { toast.error("Data centre name is required."); return; }
    if (!user) { toast.error("Please log in first."); return; }
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        datacenterName: form.datacenterName.trim(),
        city: form.city,
        zone: form.zone,
        serverCount: Number(form.serverCount) || 0,
        contactPhone: form.contactPhone,
        profileComplete: true,
        updatedAt: serverTimestamp(),
      });
      await fetchUserData(user.uid);
      toast.success("Data centre registered successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "8px",
    background: "#17243a", border: "1px solid rgba(0,229,255,0.15)",
    color: "#dde4f0", fontSize: "14px", outline: "none",
    fontFamily: "Inter,sans-serif",
  };
  const labelStyle = { display: "block", marginBottom: "6px", fontSize: "11px", letterSpacing: "1.5px", color: "#607d8b", fontFamily: "Rajdhani,sans-serif", fontWeight: 700 };

  return (
    <div style={{ background: "#080d18", minHeight: "100vh" }}>
      <Navbar />
      <div className="flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-lg rounded-2xl p-8"
          style={{ background: "#0f1826", border: "1px solid rgba(0,229,255,0.15)" }}>
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">🏢</div>
            <h1 style={{ fontFamily: "Rajdhani,sans-serif", color: "#00e5ff", letterSpacing: "2px", fontSize: "24px" }}>
              REGISTER YOUR DATA CENTRE
            </h1>
            <p style={{ color: "#607d8b", fontSize: "13px", marginTop: "6px" }}>
              Complete your profile to access the dashboard
            </p>
          </div>

          {user && (
            <div className="flex items-center gap-3 p-4 rounded-xl mb-6"
              style={{ background: "rgba(0,229,255,0.04)", border: "1px solid rgba(0,229,255,0.1)" }}>
              {user.photoURL && <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full" />}
              <div>
                <div style={{ color: "#dde4f0", fontSize: "14px", fontWeight: 600 }}>{user.displayName}</div>
                <div style={{ color: "#607d8b", fontSize: "12px" }}>{user.email}</div>
              </div>
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label style={labelStyle}>DATA CENTRE NAME *</label>
              <input style={inputStyle} value={form.datacenterName}
                onChange={handle("datacenterName")} placeholder="e.g. HYD-DC-01" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>CITY</label>
                <select style={inputStyle} value={form.city} onChange={handle("city")}>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>PREFERRED ZONE</label>
                <select style={inputStyle} value={form.zone} onChange={handle("zone")}>
                  {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>NUMBER OF SERVERS</label>
                <input style={inputStyle} type="number" value={form.serverCount}
                  onChange={handle("serverCount")} placeholder="e.g. 50" min="1" />
              </div>
              <div>
                <label style={labelStyle}>CONTACT PHONE</label>
                <input style={inputStyle} value={form.contactPhone}
                  onChange={handle("contactPhone")} placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>

            <div className="p-4 rounded-xl" style={{ background: "rgba(0,230,118,0.05)", border: "1px solid rgba(0,230,118,0.15)" }}>
              <p style={{ color: "#607d8b", fontSize: "12px" }}>
                🎁 <span style={{ color: "#00e676" }}>3 free AI predictions</span> are included with your account. 
                Upgrade to Pro for unlimited predictions via Razorpay.
              </p>
            </div>

            <button type="submit" disabled={saving}
              className="w-full py-3.5 rounded-xl font-bold transition-all disabled:opacity-50"
              style={{
                background: saving ? "#17243a" : "linear-gradient(135deg,#005f64,#007a82)",
                border: "1px solid #00e5ff",
                color: "#e0f7fa",
                fontFamily: "Rajdhani,sans-serif",
                letterSpacing: "2px",
                fontSize: "15px",
              }}>
              {saving ? "SAVING..." : "COMPLETE REGISTRATION"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
