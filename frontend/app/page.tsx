import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-success/10 rounded-full blur-[120px] pointer-events-none" />

      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50">
        <div className="text-2xl font-bold tracking-tighter flex items-center gap-3">
          <div className="w-10 h-10 relative overflow-hidden rounded-xl border border-card-border">
            <img
              src="/logo.png"
              alt="Aura AI Logo"
              className="w-full h-full object-cover"
            />
          </div>
          Aura AI
        </div>
        <div className="flex gap-8 items-center font-medium text-muted">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#markets" className="hover:text-foreground transition-colors">Markets</Link>
          <Link href="/login" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      <div className="z-10 text-center max-w-4xl px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          AI Engine v2.0 is Live
        </div>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-tight">
          Trade Smarter with <span className="text-gradient">Artificial Intelligence</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted mb-12 max-w-2xl mx-auto leading-relaxed">
          The ultimate platform for Forex, Crypto, and Meme Coins. Powered by predictive analytics and automated risk management.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button className="btn-primary text-lg px-10 py-4 shadow-xl shadow-accent/20">
            Start Live Trading
          </button>
          <button className="px-10 py-4 rounded-xl border border-card-border bg-card/50 backdrop-blur-md font-semibold hover:border-muted transition-all text-lg">
            View Market Analysis
          </button>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="glass-card">
            <div className="text-accent text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-2">Meme Coin Scanner</h3>
            <p className="text-muted">Real-time sentiment analysis and trend detection for viral tokens on Solana and Ethereum.</p>
          </div>
          <div className="glass-card">
            <div className="text-success text-3xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Predictive Models</h3>
            <p className="text-muted">Advanced LSTM and Reinforcement Learning models trained on decadal market data.</p>
          </div>
          <div className="glass-card">
            <div className="text-warning text-3xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold mb-2">Automated Risk</h3>
            <p className="text-muted">Dynamic stop-loss and position sizing to protect your capital while you sleep.</p>
          </div>
        </div>
      </div>

      <footer className="mt-24 text-muted text-sm border-t border-card-border w-full py-8 text-center bg-card/10 backdrop-blur-xl">
        © 2026 Aura AI Trading Platform. All Rights Reserved.
      </footer>
    </main>
  );
}
