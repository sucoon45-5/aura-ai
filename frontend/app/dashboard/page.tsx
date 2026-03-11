"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import StatCard from '@/components/StatCard';
import TradeCard from '@/components/TradeCard';
import PerformanceChart from '@/components/PerformanceChart';
import { Zap, Bell, Search, Plus } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('crypto');
    const [stats, setStats] = useState<any>(null);
    const [trades, setTrades] = useState<any[]>([]);
    const [botActive, setBotActive] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const getAuthHeaders = () => {
        const token = localStorage.getItem('aura_token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    const fetchBotStatus = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/bot/status/1`, {
                headers: getAuthHeaders()
            });
            if (res.status === 401) return router.push('/login');
            const data = await res.json();
            setBotActive(data.is_auto_trading);
        } catch (err) {
            console.error("Failed to fetch bot status");
        }
    };

    const toggleBot = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/bot/toggle/1?status=${!botActive}`, {
                method: 'POST',
                headers: getAuthHeaders()
            });
            if (res.status === 401) return router.push('/login');
            const data = await res.json();
            setBotActive(data.status);
        } catch (err) {
            console.error("Failed to toggle bot");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('aura_token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const statsRes = await fetch(`${API_BASE_URL}/dashboard/stats`, {
                    headers: getAuthHeaders()
                });
                if (statsRes.status === 401) return router.push('/login');
                const statsData = await statsRes.json();
                setStats(statsData);

                const tradesRes = await fetch(`${API_BASE_URL}/dashboard/trades`, {
                    headers: getAuthHeaders()
                });
                const tradesData = await tradesRes.json();
                setTrades(tradesData);

                await fetchBotStatus();
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                setLoading(false);
            }
        };

        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !stats) {
        return <div className="flex h-screen items-center justify-center bg-background text-foreground">Loading Aura AI Dashboard...</div>;
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-10">
                {/* Header */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-1">Trading Overview</h1>
                        <p className="text-muted">Welcome back! Your automated bot is running smoothly.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search markets..."
                                className="bg-card border border-card-border rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-accent transition-all w-64"
                            />
                        </div>
                        <button className="p-2.5 rounded-xl border border-card-border hover:bg-card transition-all relative">
                            <Bell size={20} className="text-muted" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background"></span>
                        </button>
                        <button className="btn-primary flex items-center gap-2">
                            <Plus size={20} />
                            <span>New Trade</span>
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <StatCard
                        label="Portfolio Value"
                        value={`$${stats?.portfolio_value?.toLocaleString() || '---'}`}
                        trend={stats?.trend || 'up'}
                        trendValue={`${stats?.profit_pct_24h || '0'}%`}
                    />
                    <StatCard
                        label="Total Profit (24h)"
                        value={`+$${stats?.total_profit_24h?.toLocaleString() || '0.00'}`}
                        trend="up"
                        trendValue="Live"
                    />
                    <StatCard label="Active Trades" value={stats?.active_trades?.toString() || '0'} />
                    <StatCard label="AI Confidence Avg" value={`${stats?.ai_confidence_avg || '0'}%`} trend="up" trendValue="High" />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    {/* Chart Section */}
                    <div className="lg:col-span-2 glass-card">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Portfolio Performance</h3>
                            <select className="bg-card border border-card-border rounded-lg px-3 py-1 text-sm outline-none cursor-pointer">
                                <option>Last 12 Months</option>
                                <option>Last 30 Days</option>
                                <option>All Time</option>
                            </select>
                        </div>
                        <PerformanceChart />
                    </div>

                    {/* Allocation Section */}
                    <div className="glass-card">
                        <h3 className="text-xl font-bold mb-6">Asset Allocation</h3>
                        <div className="space-y-6">
                            {(stats?.allocation || [
                                { name: 'Bitcoin', symbol: 'BTC', color: 'bg-orange-500', value: '45%' },
                                { name: 'Ethereum', symbol: 'ETH', color: 'bg-blue-500', value: '30%' },
                            ]).map((asset: any) => (
                                <div key={asset.symbol}>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${asset.color}`} />
                                            <span className="font-semibold text-sm">{asset.name}</span>
                                        </div>
                                        <span className="text-sm font-bold">{asset.value}</span>
                                    </div>
                                    <div className="w-full bg-card-border rounded-full h-1.5">
                                        <div className={`${asset.color} h-1.5 rounded-full`} style={{ width: asset.value }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="mt-8 text-accent text-sm font-bold flex items-center gap-2 hover:underline">
                            View Detailed Allocation Overview
                        </button>
                    </div>
                </div>
                <div className={`border rounded-2xl p-6 mb-10 flex items-center justify-between transition-all ${botActive ? 'bg-success/10 border-success/20' : 'bg-accent/10 border-accent/20'}`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${botActive ? 'bg-success animate-pulse' : 'bg-accent'}`}>
                            <Zap className="text-white" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">
                                {botActive ? 'Automated Trading Bot is LIVE' : 'AI Trading Bot is READY'}
                            </h3>
                            <p className={`text-sm font-medium ${botActive ? 'text-success' : 'text-accent'}`}>
                                {botActive ? 'Executing high-probability trades across 250+ pairs' : 'Click start to enable AI-powered automated trading'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={toggleBot}
                        className={`btn-primary px-8 ${botActive ? 'bg-danger hover:bg-danger/80 border-danger/20 shadow-danger/20' : ''}`}
                    >
                        {botActive ? 'Stop Trading Bot' : 'Start Live Trading'}
                    </button>
                </div>

                {/* Tabs & Trades */}
                <div className="mb-6 flex justify-between items-end">
                    <div className="flex gap-8 border-b border-card-border pb-1">
                        <button
                            onClick={() => setActiveTab('crypto')}
                            className={`pb-3 font-semibold transition-all relative ${activeTab === 'crypto' ? 'text-foreground' : 'text-muted hover:text-foreground'}`}
                        >
                            Cryptocurrency
                            {activeTab === 'crypto' && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-accent"></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab('forex')}
                            className={`pb-3 font-semibold transition-all relative ${activeTab === 'forex' ? 'text-foreground' : 'text-muted hover:text-foreground'}`}
                        >
                            Forex
                            {activeTab === 'forex' && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-accent"></div>}
                        </button>
                    </div>
                    <div className="text-sm text-muted">
                        Last updated: <span className="text-foreground font-medium">Real-time</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {trades.map((trade, i) => (
                        <TradeCard key={i} {...trade} />
                    ))}
                </div>
            </main>
        </div>
    );
}
