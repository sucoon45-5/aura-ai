"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Github, Mail, ArrowRight, Zap, Shield, Globe, Loader2 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function LoginPage() {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (mode === 'register') {
                const res = await fetch(`${API_BASE_URL.replace('/api', '')}/auth/register?email=${email}&password=${password}`, {
                    method: 'POST',
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.detail || 'Registration failed');

                // On success, switch to login
                setMode('login');
                setError('Registration successful! Please sign in.');
            } else {
                // Login uses OAuth2 form data format
                const formData = new FormData();
                formData.append('username', email); // OAuth2 uses 'username' for email
                formData.append('password', password);

                const res = await fetch(`${API_BASE_URL.replace('/api', '')}/auth/login`, {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.detail || 'Login failed');

                // Store token and redirect
                localStorage.setItem('aura_token', data.access_token);
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* Left Column: Visual/Marketing */}
            <div className="hidden lg:flex flex-col w-[45%] bg-card border-r border-card-border p-16 relative overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[100%] h-[100%] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="flex items-center gap-3 mb-20 relative z-10">
                    <div className="w-12 h-12 relative overflow-hidden rounded-2xl border border-card-border shadow-2xl shadow-accent/20">
                        <img
                            src="/logo.png"
                            alt="Aura AI Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="text-2xl font-black tracking-tight">Aura AI</span>
                </div>

                <div className="space-y-12 relative z-10 my-auto">
                    <h2 className="text-5xl font-black leading-[1.1] tracking-tight">
                        The Future of <br />
                        <span className="text-accent underline decoration-accent/20 decoration-8 underline-offset-8">Algorithmic</span> Trading
                    </h2>

                    <div className="space-y-8">
                        {[
                            { icon: <Zap className="text-accent" />, title: "Meme Coin Scanner", desc: "Never miss a viral surge with our real-time sentiment tracker." },
                            { icon: <Shield className="text-accent" />, title: "Risk Mitigation", desc: "Advanced SL/TP flows trained on 5 years of historical volatility." },
                            { icon: <Globe className="text-accent" />, title: "Global Markets", desc: "One unified dashboard for Crypto, Forex, and Indices." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-12 h-12 bg-card-border rounded-xl flex items-center justify-center shrink-0 border border-card-border/50">
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">{item.title}</h4>
                                    <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-auto relative z-10">
                    <div className="flex items-center -space-x-3 mb-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full bg-card-border border-2 border-card ring-1 ring-card-border" />
                        ))}
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-[10px] font-black border-2 border-background">+8k</div>
                    </div>
                    <p className="text-muted text-xs font-medium">Join 8,400+ active traders using Aura today.</p>
                </div>
            </div>

            {/* Right Column: Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 relative overflow-hidden">
                <div className="absolute bottom-[-10%] left-[-10%] w-[100%] h-[100%] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="w-full max-w-sm space-y-10 relative z-10">
                    <div className="text-center lg:text-left space-y-2">
                        <h3 className="text-3xl font-black">{mode === 'login' ? 'Sign In' : 'Create Account'}</h3>
                        <p className="text-muted text-sm">
                            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                            <button
                                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                                className="text-accent font-bold hover:underline"
                            >
                                {mode === 'login' ? 'Register here' : 'Login here'}
                            </button>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-danger/10 border border-danger/20 text-danger text-xs font-bold p-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-muted tracking-widest pl-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full bg-card border border-card-border rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-accent transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] uppercase font-black text-muted tracking-widest">Password</label>
                                {mode === 'login' && <button type="button" className="text-[10px] font-bold text-muted hover:text-accent transition-colors">Forgot Password?</button>}
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="****************"
                                className="w-full bg-card border border-card-border rounded-xl px-4 py-3.5 outline-none focus:border-accent transition-all font-medium"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 group py-4 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    <span>{mode === 'login' ? 'Continue to Dashboard' : 'Create My Account'}</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-card-border"></div></div>
                        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="bg-background px-4 text-muted">Or complete with</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-card-border hover:bg-card transition-all font-bold text-sm">
                            <Github size={20} />
                            GitHub
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-card-border hover:bg-card transition-all font-bold text-sm">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.73 17.1,6.73L19.05,4.72C19.05,4.72 16.13,2 12.1,2C6.5,2 2,6.5 2,12C2,17.5 6.5,22 12.1,22C17.7,22 22,17.5 22,12C22,11.75 21.95,11.2 21.35,11.1V11.1Z" />
                            </svg>
                            Google
                        </button>
                    </div>

                    <p className="text-center text-[10px] text-muted leading-relaxed">
                        By continuing, you agree to Aura AI's <br />
                        <span className="font-bold underline cursor-pointer">Terms of Service</span> and <span className="font-bold underline cursor-pointer">Privacy Policy</span>.
                    </p>
                </div>
            </div>
        </div>
    );
}
