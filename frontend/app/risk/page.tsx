"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { ShieldCheck, Octagon, Save, AlertTriangle, Info } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

export default function RiskPage() {
    const [settings, setSettings] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE_URL}/risk/settings`)
            .then(res => res.json())
            .then(setSettings)
            .catch(err => console.error("Risk settings error:", err));
    }, []);

    const handleUpdate = async () => {
        setSaving(true);
        try {
            await fetch(`${API_BASE_URL}/risk/settings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            setTimeout(() => setSaving(false), 800);
        } catch (err) {
            console.error(err);
            setSaving(false);
        }
    };

    if (!settings) return <div className="flex h-screen items-center justify-center">Initializing Risk Perimeter...</div>;

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-10">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-1">Risk Manager</h1>
                        <p className="text-muted">Configure your safety guardrails and bot behavior.</p>
                    </div>
                    <button
                        onClick={handleUpdate}
                        disabled={saving}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${saving ? 'bg-muted cursor-not-allowed opacity-50' : 'bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20'}`}
                    >
                        <Save size={20} />
                        <span>{saving ? 'Saving...' : 'Deploy Settings'}</span>
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-10">
                        {/* Bot Control */}
                        <div className="glass-card">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl ${settings.bot_enabled ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                                        <ShieldCheck size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Automation Master Switch</h3>
                                        <p className="text-sm text-muted">Toggle all automated trading activity.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, bot_enabled: !settings.bot_enabled })}
                                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none ${settings.bot_enabled ? 'bg-success' : 'bg-card-border'}`}
                                >
                                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${settings.bot_enabled ? 'translate-x-9' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            <div className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${!settings.bot_enabled ? 'bg-danger/5 border-danger/20 text-danger' : 'bg-success/5 border-success/20 text-success'}`}>
                                <Info size={20} />
                                <p className="text-sm font-medium">Aura Bot is currently {settings.bot_enabled ? 'ACTIVE and MONITORING' : 'OFFLINE and IDLE'}.</p>
                            </div>
                        </div>

                        {/* Guardrails */}
                        <div className="glass-card">
                            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                                <Octagon className="text-danger" />
                                Stop-Loss Guardrails
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="font-semibold text-sm">Max Daily Loss Limit</label>
                                        <span className="text-accent font-black">{settings.max_daily_loss}%</span>
                                    </div>
                                    <input
                                        type="range" min="1" max="15" step="0.5"
                                        value={settings.max_daily_loss}
                                        onChange={(e) => setSettings({ ...settings, max_daily_loss: parseFloat(e.target.value) })}
                                        className="w-full accent-accent h-1.5 rounded-full cursor-pointer"
                                    />
                                    <p className="text-[10px] text-muted mt-2 uppercase text-right tracking-widest font-bold">Safe Zone: 1-5%</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted uppercase">Default Stop-Loss</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={settings.default_stop_loss}
                                                onChange={(e) => setSettings({ ...settings, default_stop_loss: parseFloat(e.target.value) })}
                                                className="w-full bg-card border border-card-border rounded-xl px-4 py-3 outline-none focus:border-danger transition-all font-bold"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted font-bold">%</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted uppercase">Default Take-Profit</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={settings.default_take_profit}
                                                onChange={(e) => setSettings({ ...settings, default_take_profit: parseFloat(e.target.value) })}
                                                className="w-full bg-card border border-card-border rounded-xl px-4 py-3 outline-none focus:border-success transition-all font-bold"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted font-bold">%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {/* Leverage & Margin */}
                        <div className="glass-card">
                            <h3 className="text-xl font-bold mb-8">Leverage & Margin</h3>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    {[1, 5, 10, 20, 50, 100].map(x => (
                                        <button
                                            key={x}
                                            onClick={() => setSettings({ ...settings, leverage: x })}
                                            className={`p-4 rounded-xl border font-black transition-all ${settings.leverage === x ? 'border-accent bg-accent/10 text-accent scale-105' : 'border-card-border hover:border-accent/40'}`}
                                        >
                                            {x}x
                                        </button>
                                    ))}
                                </div>
                                <div className="p-4 bg-muted/10 rounded-xl border border-dashed border-card-border flex items-start gap-4">
                                    <AlertTriangle className="text-warning shrink-0" size={20} />
                                    <div>
                                        <p className="text-xs font-bold uppercase text-warning mb-1">Leverage Warning</p>
                                        <p className="text-[11px] text-muted leading-relaxed">High leverage ({settings.leverage}x) significantly increases the risk of liquidation. Use with extreme caution.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
