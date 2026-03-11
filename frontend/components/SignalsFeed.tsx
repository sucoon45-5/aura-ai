import { Zap, Clock, AlertCircle } from 'lucide-react';

const SignalsFeed = () => {
    const signals = [
        { symbol: 'BTC/USDT', type: 'BUY', confidence: 88, time: '2 mins ago', indicators: 'RSI OVERSOLD' },
        { symbol: 'ETH/USDT', type: 'SELL', confidence: 72, time: '15 mins ago', indicators: 'MACD CROSSOVER' },
        { symbol: 'PEPE/USDT', type: 'BUY', confidence: 94, time: '1 hour ago', indicators: 'WHALE ACCUMULATION' },
        { symbol: 'EUR/USD', type: 'HOLD', confidence: 60, time: '3 hours ago', indicators: 'CONSOLIDATION' },
    ];

    return (
        <div className="space-y-4">
            {signals.map((signal, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-card-border bg-card/30 hover:bg-card/50 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${signal.type === 'BUY' ? 'bg-success/20 text-success' :
                                signal.type === 'SELL' ? 'bg-danger/20 text-danger' : 'bg-muted/20 text-muted'
                            }`}>
                            {signal.type === 'BUY' ? <Zap size={20} /> :
                                signal.type === 'SELL' ? <AlertCircle size={20} /> : <Clock size={20} />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold">{signal.symbol}</span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${signal.type === 'BUY' ? 'border-success/30 text-success' :
                                        signal.type === 'SELL' ? 'border-danger/30 text-danger' : 'border-muted/30 text-muted'
                                    }`}>
                                    {signal.type}
                                </span>
                            </div>
                            <p className="text-xs text-muted">{signal.indicators} • {signal.time}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted mb-1">Confidence</p>
                        <div className="flex items-center gap-2">
                            <div className="w-16 bg-card-border h-1.5 rounded-full overflow-hidden">
                                <div className="bg-accent h-full" style={{ width: `${signal.confidence}%` }} />
                            </div>
                            <span className="text-sm font-bold">{signal.confidence}%</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SignalsFeed;
