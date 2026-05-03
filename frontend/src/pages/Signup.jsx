import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { EyeIcon, EyeSlashIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function Signup() {
    const BASE = import.meta.env.VITE_DJANGO_BASE_URL;
    const [form, setForm] = useState({ username: "", email: "", password: "", password2: "" });
    const [msg, setMsg] = useState("");
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const nav = useNavigate();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const pwStrength = () => {
        const p = form.password;
        if (!p) return 0;
        let score = 0;
        if (p.length >= 8) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        return score;
    };
    const strength = pwStrength();
    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-lime-400', 'bg-emerald-500'];

    const handleSubmit = async e => {
        e.preventDefault();
        setMsg(""); setIsError(false);
        if (form.password !== form.password2) { setMsg("Passwords don't match"); setIsError(true); return; }
        setIsLoading(true);
        try {
            const res = await fetch(`${BASE}/api/register/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok) {
                setMsg("Account created! Logging you in...");
                setIsError(false);
                
                // Auto-login after successful registration
                try {
                    const loginRes = await fetch(`${BASE}/api/token/`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                            username: form.username, 
                            password: form.password 
                        }),
                    });
                    
                    if (loginRes.ok) {
                        const loginData = await loginRes.json();
                        localStorage.setItem("access_token", loginData.access);
                        localStorage.setItem("refresh_token", loginData.refresh);
                        
                        // Fetch user info
                        const userRes = await fetch(`${BASE}/api/user/`, {
                            headers: { 
                                "Authorization": `Bearer ${loginData.access}`,
                                "Content-Type": "application/json"
                            },
                        });
                        
                        if (userRes.ok) {
                            const userInfo = await userRes.json();
                            localStorage.setItem('user', JSON.stringify(userInfo));
                        }
                        
                        setTimeout(() => {
                            window.location.href = '/'; // Force full page reload
                        }, 1200);
                    } else {
                        // If auto-login fails, redirect to login page
                        setTimeout(() => nav("/login"), 1200);
                    }
                } catch (loginError) {
                    console.error('Auto-login error:', loginError);
                    setTimeout(() => nav("/login"), 1200);
                }
            } else {
                setMsg(data.username?.[0] || data.password?.[0] || data.email?.[0] || "Signup failed");
                setIsError(true);
            }
        } catch {
            setMsg("Connection error. Please try again.");
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const perks = ['Plant a tree with every order', 'Exclusive eco deals & offers', 'Carbon-neutral shipping always'];

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #dcfce7 100%)' }}>
            <SEO title="Sign Up — Zymerce" description="Create your Zymerce account for eco-friendly shopping." />

            <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full opacity-30 blur-3xl" style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />
            <div className="absolute bottom-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />

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

                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/10 border border-white/60 p-8">
                    <h1 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Join the movement 🌍</h1>
                    <p className="text-gray-500 text-sm mb-8">Create your free eco-friendly account today</p>

                    {/* Perks */}
                    <div className="bg-emerald-50 rounded-2xl p-4 mb-6 space-y-2">
                        {perks.map((p, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-emerald-700">
                                <CheckCircleIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                {p}
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                            <input name="username" value={form.username} onChange={handleChange} placeholder="Choose a username" required className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email <span className="text-gray-400 font-normal">(optional)</span></label>
                            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input name="password" type={showPw ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="Create a strong password" required className="input-field pr-12" />
                                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPw ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </div>
                            {form.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : 'bg-gray-200'}`} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500">{strengthLabel[strength]} password</p>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                            <input name="password2" type="password" value={form.password2} onChange={handleChange} placeholder="Repeat your password" required
                                className={`input-field ${form.password2 && form.password2 !== form.password ? 'border-red-300 focus:border-red-400' : ''}`} />
                            {form.password2 && form.password2 !== form.password && (
                                <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                            )}
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
                                    Creating account...
                                </span>
                            ) : 'Create Free Account 🌿'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
