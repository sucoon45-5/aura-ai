"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { User, Key, Bell, Palette, Lock, Eye, EyeOff } from 'lucide-react';

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('profile');
    const [showKey, setShowKey] = useState(false);

    const sections = [
        { id: 'profile', icon: <User size={20} />, label: 'Profile Settings' },
        { id: 'exchanges', icon: <Key size={20} />, label: 'Exchange API Keys' },
        { id: 'security', icon: <Lock size={20} />, label: 'Security & 2FA' },
        { id: 'notifications', icon: <Bell size={20} />, label: 'Notifications' },
        { id: 'appearance', icon: <Palette size={20} />, label: 'Appearance' },
    ];

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-10">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Account Settings</h1>
                    <p className="text-muted">Manage your identity, API keys, and app preferences.</p>
                </header>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Navigation */}
                    <nav className="w-full lg:w-72 space-y-2">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`flex items-center gap-3 px-6 py-4 rounded-2xl w-full text-left font-bold transition-all ${activeSection === section.id ? 'bg-accent text-white shadow-lg shadow-accent/20 scale-105' : 'bg-card border border-card-border hover:bg-card/50 text-muted'}`}
                            >
                                {section.icon}
                                {section.label}
                            </button>
                        ))}
                    </nav>

                    {/* Content */}
                    <div className="flex-1 glass-card">
                        {activeSection === 'profile' && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <h3 className="text-2xl font-bold">Personal Profile</h3>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-muted">First Name</label>
                                        <input type="text" defaultValue="Aura" className="input-field" placeholder="First Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-muted">Last Name</label>
                                        <input type="text" defaultValue="Trader" className="input-field" placeholder="Last Name" />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-xs font-black uppercase text-muted">Email Address</label>
                                        <input type="email" defaultValue="aura@example.com" className="input-field" placeholder="Email" />
                                    </div>
                                </div>
                                <button className="btn-primary">Update Profile</button>
                            </div>
                        )}

                        {activeSection === 'exchanges' && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-bold">Exchange API Connections</h3>
                                    <button className="text-accent font-black text-sm hover:underline">+ Link New Exchange</button>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-6 bg-card border border-card-border rounded-2xl">
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                                                    <span className="text-orange-500 font-bold">B</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold">Binance Global</p>
                                                    <p className="text-[10px] text-success uppercase font-black">Connected Successfully</p>
                                                </div>
                                            </div>
                                            <button className="text-danger text-xs font-bold hover:underline">Disconnect</button>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase font-black text-muted">API Key</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type={showKey ? "text" : "password"}
                                                        readOnly
                                                        value="************************************4A21"
                                                        className="bg-card-border/30 border-none rounded-lg px-3 py-2 text-sm flex-1 font-mono text-muted"
                                                    />
                                                    <button onClick={() => setShowKey(!showKey)} className="p-2 hover:bg-card-border/30 rounded-lg transition-all">
                                                        {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection !== 'profile' && activeSection !== 'exchanges' && (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-50">
                                <Palette size={48} className="text-muted" />
                                <h3 className="text-xl font-bold">Section Coming Soon</h3>
                                <p className="text-muted text-sm max-w-xs">We are currently building this settings module to give you more control.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
