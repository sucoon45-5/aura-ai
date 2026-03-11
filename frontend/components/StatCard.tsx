const StatCard = ({ label, value, trend, trendValue }: any) => (
    <div className="glass-card">
        <p className="text-muted text-sm font-medium mb-1">{label}</p>
        <div className="flex items-baseline gap-3">
            <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
            {trend && (
                <span className={`text-xs font-bold ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
                    {trend === 'up' ? '↑' : '↓'} {trendValue}
                </span>
            )}
        </div>
    </div>
);

export default StatCard;
