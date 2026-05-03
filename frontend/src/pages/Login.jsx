import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveTokens } from "../utils/auth";
import SEO from "../components/SEO";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Login() {
    const BASE = import.meta.env.VITE_DJANGO_BASE_URL;
    const [form, setForm] = useState({ username: "", password: "" });
    const [msg, setMsg] = useState("");
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const nav = useNavigate();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setMsg(""); setIsError(false); setIsLoading(true);
        try {
            const res = await fetch(`${BASE}/api/token/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok) {
                // Save tokens
                saveTokens(data);
                
                // Fetch user info
                try {
                    const userRes = await fetch(`${BASE}/api/user/`, {
                        headers: { 
                            "Authorization": `Bearer ${data.access}`,
                            "Content-Type": "application/json"
                        },
                    });
                    
                    if (userRes.ok) {
                        const userInfo = await userRes.json();
                        localStorage.setItem('user', JSON.stringify(userInfo));
                        
                        setMsg("Login successful! Redirecting...");
                        setIsError(false);
                        setTimeout(() => {
                            window.location.href = '/'; // Force full page reload to update Redux
                        }, 800);
                    } else {
                        throw new Error('Failed to fetch user info');
                    }
                } catch (userError) {
                    console.error('User fetch error:', userError);
                    setMsg("Login successful! Redirecting...");
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 800);
                }
            } else {
                setMsg(data.detail || "Invalid username or password");
                setIsError(true);
            }
        } catch {
            setMsg("Connection error. Please try again.");
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #dcfce7 100%)' }}>
            <SEO title="Login — Zymerce" description="Sign in to your Zymerce account." />

            {/* Background blobs */}
            <div className="absolute top-[-100px] left-[-100px] w-80 h-80 rounded-full opacity-30 blur-3xl" style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />
            <div className="absolute bottom-[-100px] right-[-100px] w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />

            <div className="relative w-full max-w-md animate-scale-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl" style={{ background: 'linear-gradient(135deg, #0f5132, #10b981)' }}>
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3l14 9-14 9V3z" /></svg>
                        </div>
                        <span className="text-2xl font-black text-primary">Zymerce</span>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/10 border border-white/60 p-8">
                    <h1 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Welcome back 🌿</h1>
                    <p className="text-gray-500 text-sm mb-8">Sign in to continue your eco journey</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                            <input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                required
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                    className="input-field pr-12"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded accent-primary" />
                                Remember me
                            </label>
                            <a href="#" className="text-sm text-primary font-semibold hover:underline">Forgot password?</a>
                        </div>

                        {msg && (
                            <div className={`px-4 py-3 rounded-2xl text-sm font-medium animate-fade-in ${isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                                {isError ? '⚠️ ' : '✅ '}{msg}
                            </div>
                        )}

                        <button type="submit" disabled={isLoading}
                            className="w-full btn-ripple py-4 rounded-2xl text-white font-bold text-base transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                            style={{ background: 'linear-gradient(135deg, #0f5132, #10b981)' }}>
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Signing in...
                                </span>
                            ) : 'Sign In 🌿'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-primary font-bold hover:underline">Create one free</Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    By signing in, you agree to our <a href="#" className="text-primary hover:underline">Terms</a> &amp; <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
}
