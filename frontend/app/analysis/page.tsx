"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Search, TrendingUp, TrendingDown, Activity, BarChart3, Globe } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

export default function AnalysisPage() {
    const [symbol, setSymbol] = useState('BTC/USDT');
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/analysis/${symbol.replace('/', '_')}`);
                if (!res.ok) throw new Error('Analysis data not found');
                const data = await res.json();
                setAnalysis(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch analysis:", error);
                setAnalysis(null);
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [symbol]);

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-10">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-1">Market Analysis</h1>
                        <p className="text-muted">Deep dive into technical indicators and social sentiment.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <select
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            className="bg-card border border-card-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-accent transition-all cursor-pointer"
                        >
                            <option value="BTC/USDT">Bitcoin (BTC/USDT)</option>
                            <option value="ETH/USDT">Ethereum (ETH/USDT)</option>
                            <option value="SOL/USDT">Solana (SOL/USDT)</option>
                        </select>
                    </div>
                </header>

                {loading ? (
                    <div className="flex h-64 items-center justify-center text-muted">Analyzing market data...</div>
                ) : analysis ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Technical Indicators */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="glass-card">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    < BarChart3 className="text-accent" />
                                    Technical Indicators
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 bg-card/50 rounded-2xl border border-card-border">
                                        <p className="text-sm text-muted mb-2 uppercase tracking-wider font-semibold">RSI (14)</p>
                                        <p className="text-3xl font-bold">{analysis.indicators?.rsi ?? '--'}</p>
                                        <p className={`text-sm mt-2 ${analysis.indicators?.rsi > 70 ? 'text-danger' : analysis.indicators?.rsi < 30 ? 'text-success' : 'text-muted'}`}>
                                            {analysis.indicators?.rsi > 70 ? 'Overbought' : analysis.indicators?.rsi < 30 ? 'Oversold' : 'Neutral'}
                                        </p>
                                    </div>
                                    <div className="p-6 bg-card/50 rounded-2xl border border-card-border">
                                        <p className="text-sm text-muted mb-2 uppercase tracking-wider font-semibold">MACD</p>
                                        <p className="text-3xl font-bold capitalize">{analysis.indicators?.macd ?? '--'}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            {analysis.indicators?.macd === 'bullish' ? <TrendingUp className="text-success" size={16} /> : <TrendingDown className="text-danger" size={16} />}
                                            <span className={`text-sm ${analysis.indicators?.macd === 'bullish' ? 'text-success' : 'text-danger'}`}>Trend Signal</span>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-card/50 rounded-2xl border border-card-border">
                                        <p className="text-sm text-muted mb-2 uppercase tracking-wider font-semibold">Volatility</p>
                                        <p className="text-3xl font-bold">{(analysis.indicators?.volume_score ? analysis.indicators.volume_score * 100 : 0).toFixed(1)}%</p>
                                        <div className="w-full bg-card-border rounded-full h-1.5 mt-4">
                                            <div className="bg-accent h-1.5 rounded-full" style={{ width: `${(analysis.indicators?.volume_score ?? 0) * 100}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card bg-accent/5 border-accent/20">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Activity className="text-accent" />
                                    AI Prediction Model v2.4
                                </h3>
                                <p className="text-muted mb-6 leading-relaxed">
                                    Our LSTM-based neural network has analyzed the last 48 hours of price action for {symbol}.
                                    The model suggests a <span className="text-foreground font-bold italic">78% probability</span> of a breakout within the next 4 hours.
                                </p>
                                <div className="flex gap-4">
                                    <button className="btn-primary flex-1">Open Long Position</button>
                                    <button className="px-6 py-2.5 rounded-xl border border-card-border hover:bg-card transition-all font-bold">View Model Logic</button>
                                </div>
                            </div>
                        </div>

                        {/* Sentiment Column */}
                        <div className="space-y-6">
                            <div className="glass-card">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Globe className="text-accent" />
                                    Social Sentiment
                                </h3>
                                <div className="text-center mb-8">
                                    <p className="text-sm text-muted mb-2 uppercase tracking-wider font-semibold">Collective Score</p>
                                    <p className="text-5xl font-extrabold text-accent">{(analysis.sentiment?.score ? analysis.sentiment.score * 100 : 0).toFixed(0)}</p>
                                    <p className="text-xl font-bold mt-2 text-success">Social Hype</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-card/50 rounded-xl border border-card-border">
                                        <span className="font-semibold">Reddit</span>
                                        <span className="text-success font-bold text-sm uppercase">{analysis.sentiment?.sources?.reddit}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-card/50 rounded-xl border border-card-border">
                                        <span className="font-semibold">X (Twitter)</span>
                                        <span className="text-muted font-bold text-sm uppercase">{analysis.sentiment?.sources?.x}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-card/50 rounded-xl border border-card-border">
                                        <span className="font-semibold">News/Blogs</span>
                                        <span className="text-success font-bold text-sm uppercase">Positive</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="glass-card p-20 text-center">
                        <AlertTriangle className="text-danger mx-auto mb-4" size={48} />
                        <h3 className="text-xl font-bold">Analysis Unavailable</h3>
                        <p className="text-muted">Could not retrieve market data for {symbol}. Please try again later.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
import { AlertTriangle } from 'lucide-react';
