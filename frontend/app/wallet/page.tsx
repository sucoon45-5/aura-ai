"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Wallet, ArrowUpRight, ArrowDownRight, RefreshCw, CreditCard, History } from 'lucide-react';
import { toast } from 'sonner';

export default function WalletPage() {
    const [balance] = useState(145230.50);
    const [assets] = useState([
        { symbol: 'USDT', name: 'Tether', balance: 45000.00, value: 45000.00, color: 'text-success' },
        { symbol: 'BTC', name: 'Bitcoin', balance: 1.2, value: 85200.00, color: 'text-accent' },
        { symbol: 'ETH', name: 'Ethereum', balance: 4.5, value: 15030.50, color: 'text-primary' },
    ]);

    const handleAction = (action: string) => {
        toast.success(`${action} Initiated`, {
            description: `Your request to ${action.toLowerCase()} funds is being processed.`,
        });
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-10">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-1">Portfolio Wallet</h1>
                        <p className="text-muted">Manage your funds, deposits, and withdrawals securely.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    {/* Total Balance Card */}
                    <div className="glass-card lg:col-span-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-2">Total Estimated Balance</h3>
                        <p className="text-5xl font-black mb-6">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>

                        <div className="flex gap-4">
                            <button onClick={() => handleAction('Deposit')} className="btn-primary flex items-center justify-center gap-2 flex-1">
                                <ArrowDownRight size={20} />
                                Deposit
                            </button>
                            <button onClick={() => handleAction('Withdraw')} className="px-6 py-3 rounded-xl border border-card-border hover:bg-card flex items-center justify-center gap-2 transition-all font-bold text-foreground flex-1">
                                <ArrowUpRight size={20} />
                                Withdraw
                            </button>
                            <button onClick={() => handleAction('Swap')} className="px-6 py-3 rounded-xl border border-card-border hover:bg-card flex items-center justify-center gap-2 transition-all font-bold text-foreground flex-1">
                                <RefreshCw size={20} />
                                Swap
                            </button>
                        </div>
                    </div>

                    {/* Quick Deposit Method */}
                    <div className="glass-card flex flex-col justify-center items-center text-center group cursor-pointer hover:border-accent/40 transition-all" onClick={() => handleAction('Link Bank Account')}>
                        <div className="w-16 h-16 rounded-2xl bg-card border border-card-border flex items-center justify-center text-muted group-hover:text-accent group-hover:scale-110 transition-all mb-4">
                            <CreditCard size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Fund with Fiat</h3>
                        <p className="text-sm text-muted">Connect your bank account or credit card for instant USD deposits.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Asset List */}
                    <div className="glass-card lg:col-span-2">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Wallet className="text-accent" />
                            Your Assets
                        </h3>
                        <div className="space-y-4">
                            {assets.map((asset) => (
                                <div key={asset.symbol} className="flex justify-between items-center p-4 rounded-xl border border-card-border hover:bg-card/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-background border border-card-border flex items-center justify-center font-black">
                                            {asset.symbol[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-bold">{asset.name}</h4>
                                            <p className="text-xs text-muted font-semibold">{asset.symbol}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <h4 className="font-bold">${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h4>
                                        <p className="text-xs text-muted font-semibold">{asset.balance} {asset.symbol}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="glass-card">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <History className="text-accent" />
                            Recent Activity
                        </h3>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex justify-between items-center py-3 border-b border-card-border/50 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i % 2 === 0 ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
                                            {i % 2 === 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{i % 2 === 0 ? 'Withdrawal' : 'Deposit'}</p>
                                            <p className="text-[10px] text-muted uppercase">Today, 14:{i}0 PM</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-bold ${i % 2 === 0 ? '' : 'text-success'}`}>
                                            {i % 2 === 0 ? '-' : '+'}${(i * 500).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </p>
                                        <p className="text-[10px] text-muted uppercase">Completed</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
