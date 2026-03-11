import { TrendingUp, TrendingDown } from 'lucide-react';

const TradeCard = ({ symbol, side, entry, current, pnl, status }: any) => {
    const isProfit = pnl >= 0;

    return (
        <div className="glass-card hover:translate-y-[-2px]">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="font-bold text-lg">{symbol}</h4>
                    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${side === 'buy' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                        {side}
                    </span>
                </div>
                <div className={`text-sm font-bold flex items-center gap-1 ${isProfit ? 'text-success' : 'text-danger'}`}>
                    {isProfit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {isProfit ? '+' : ''}{pnl}%
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-muted text-xs">Entry Price</p>
                    <p className="font-medium">${entry}</p>
                </div>
                <div>
                    <p className="text-muted text-xs">Current Price</p>
                    <p className="font-medium">${current}</p>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-card-border flex justify-between items-center text-xs">
                <span className="text-muted italic">{status}</span>
                <button className="text-accent font-semibold hover:underline">Manage</button>
            </div>
        </div>
    );
};

export default TradeCard;
