import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      // Check if user doc exists; create if new
      const ref  = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        // New user → go to register page to complete profile
        await setDoc(ref, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: "datacenter",
          freePredictions: 3,
          subscribed: false,
          createdAt: serverTimestamp(),
        });
        toast.success("Welcome! Please complete your profile.");
        navigate("/register");
      } else {
        const data = snap.data();
        toast.success(`Welcome back, ${user.displayName?.split(" ")[0]}!`);
        if (data.role === "admin") navigate("/admin");
        else navigate("/dashboard");
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: `linear-gradient(135deg, #080d18 0%, #0f1826 100%)`,
        backgroundImage: `
          linear-gradient(135deg, #080d18 0%, #0f1826 100%),
          url("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&auto=format&fit=crop")
        `,
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(#00e5ff 1px,transparent 1px),linear-gradient(90deg,#00e5ff 1px,transparent 1px)", backgroundSize: "50px 50px" }} />

      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div
          className="w-full max-w-md rounded-2xl p-8"
          style={{
            background: "rgba(15,24,38,0.75)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(0,229,255,0.18)",
            boxShadow: "0 0 60px rgba(0,229,255,0.07)",
          }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🌡️</div>
            <h1 style={{ fontFamily: "Rajdhani,sans-serif", color: "#00e5ff", letterSpacing: "3px", fontSize: "26px", fontWeight: 700 }}>
              THERMAL<span style={{ color: "#ffab00" }}>SPIKE</span>
            </h1>
            <p className="text-sm mt-2" style={{ color: "#607d8b" }}>AI-Powered Data Centre Thermal Monitoring</p>
          </div>

          <div className="mb-6 p-4 rounded-xl" style={{ background: "rgba(0,229,255,0.04)", border: "1px solid rgba(0,229,255,0.1)" }}>
            <p className="text-center text-sm" style={{ color: "#607d8b" }}>
              Sign in with your Google account to access<br />
              <span style={{ color: "#dde4f0" }}>your data centre dashboard</span>
            </p>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-bold transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50"
            style={{
              background: loading ? "#17243a" : "#fff",
              color: "#1f2937",
              fontFamily: "Rajdhani,sans-serif",
              letterSpacing: "1.5px",
              fontSize: "15px",
            }}
          >
            {loading ? (
              <span style={{ color: "#607d8b" }}>CONNECTING...</span>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                CONTINUE WITH GOOGLE
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs" style={{ color: "#607d8b" }}>
              New here?{" "}
              <Link to="/register" style={{ color: "#00e5ff" }}>
                Register your data centre
              </Link>
            </p>
          </div>

          {/* Info chips */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {["3 Free Predictions", "Google SSO", "No Credit Card"].map(t => (
              <span key={t} className="px-3 py-1 rounded-full text-xs"
                style={{ background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.12)", color: "#607d8b" }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
