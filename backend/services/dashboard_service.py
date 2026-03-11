import ccxt
from datetime import datetime, timedelta

class DashboardService:
    @staticmethod
    def get_portfolio_stats():
        """Calculate real-time portfolio stats using live prices."""
        exchange = ccxt.binance()
        try:
            # In a real app, this would query the DB for user holdings
            # For now, we calculate based on a set of common assets
            btc_price = exchange.fetch_ticker('BTC/USDT')['last']
            eth_price = exchange.fetch_ticker('ETH/USDT')['last']
            
            # Simulated holdings
            btc_amount = 1.2
            eth_amount = 15.0
            usdt_balance = 12000.0
            
            portfolio_value = (btc_amount * btc_price) + (eth_amount * eth_price) + usdt_balance
            
            return {
                "portfolio_value": round(portfolio_value, 2),
                "total_profit_24h": round(portfolio_value * 0.035, 2), # 3.5% mock 24h profit for demo
                "active_trades": 4,
                "ai_confidence_avg": 88,
                "trend": "up" if portfolio_value > 120000 else "down"
            }
        except Exception as e:
            print(f"Error fetching dashboard stats: {e}")
            return {"error": str(e)}

    @staticmethod
    def get_performance_data():
        # Generate last 7 days of performance (still semi-random but based on a real base)
        data = []
        base_value = 120000
        for i in range(7):
            date = (datetime.now() - timedelta(days=7-i)).strftime("%Y-%m-%d")
            base_value += (base_value * 0.005) # 0.5% daily growth
            data.append({"date": date, "value": round(base_value, 2)})
        return data

    @staticmethod
    def get_active_trades():
        # In a real scenario, this would fetch from the database
        # For now, we update the current price live
        exchange = ccxt.binance()
        try:
            btc_price = exchange.fetch_ticker('BTC/USDT')['last']
            eth_price = exchange.fetch_ticker('ETH/USDT')['last']
            
            return [
                {"symbol": "BTC/USDT", "side": "buy", "entry": 64230, "current": btc_price, "pnl": round(((btc_price/64230)-1)*100, 2), "status": "Active"},
                {"symbol": "ETH/USDT", "side": "sell", "entry": 3450, "current": eth_price, "pnl": round((1-(eth_price/3450))*100, 2), "status": "Active"},
            ]
        except Exception as e:
            return []
