import { LayoutDashboard, TrendingUp, ShieldAlert, Settings, LogOut, Zap } from 'lucide-react';
import Link from 'next/link';

const Sidebar = () => {
    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Overview', href: '/dashboard' },
        { icon: <TrendingUp size={20} />, label: 'Market Analysis', href: '/analysis' },
        { icon: <Zap size={20} />, label: 'AI Signals', href: '/signals' },
        { icon: <ShieldAlert size={20} />, label: 'Risk Manager', href: '/risk' },
        { icon: <Settings size={20} />, label: 'Settings', href: '/settings' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-card-border p-6 flex flex-col z-50">
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 relative overflow-hidden rounded-xl border border-card-border">
                    <img
                        src="/logo.png"
                        alt="Aura AI Logo"
                        className="w-full h-full object-cover"
                    />
                </div>
                <span className="text-xl font-bold tracking-tighter">Aura AI</span>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted hover:text-foreground hover:bg-accent/10 transition-all group"
                    >
                        <span className="group-hover:text-accent transition-colors">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="pt-6 border-t border-card-border mt-auto">
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted hover:text-danger hover:bg-danger/5 transition-all w-full">
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
