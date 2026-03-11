import ccxt
from datetime import datetime, timedelta

class DashboardService:
    @staticmethod
    def get_portfolio_stats():
        """Calculate real-time portfolio stats using live prices."""
        exchange = ccxt.binance()
        try:
            # Simulated holdings
            btc_amount = 1.2
            eth_amount = 15.0
            usdt_balance = 12500.0
            
            # Fetch live prices
            btc_price = exchange.fetch_ticker('BTC/USDT')['last']
            eth_price = exchange.fetch_ticker('ETH/USDT')['last']
            
            btc_value = btc_amount * btc_price
            eth_value = eth_amount * eth_price
            total_value = btc_value + eth_value + usdt_balance
            
            # Use yesterday's mock base for trend comparison
            yesterday_value = total_value * 0.965 # Mock -3.5% drift for demo trend
            profit_24h = total_value - yesterday_value
            profit_pct = (profit_24h / yesterday_value) * 100
            
            return {
                "portfolio_value": round(total_value, 2),
                "total_profit_24h": round(profit_24h, 2),
                "profit_pct_24h": round(profit_pct, 2),
                "active_trades": 2,
                "ai_confidence_avg": 92,
                "trend": "up" if profit_pct > 0 else "down",
                "allocation": [
                    {"name": "Bitcoin", "symbol": "BTC", "value": f"{round((btc_value/total_value)*100)}%", "color": "bg-orange-500"},
                    {"name": "Ethereum", "symbol": "ETH", "value": f"{round((eth_value/total_value)*100)}%", "color": "bg-blue-500"},
                    {"name": "Stablecoins", "symbol": "USDT", "value": f"{round((usdt_balance/total_value)*100)}%", "color": "bg-success"},
                    {"name": "Others", "symbol": "Misc", "value": "1%", "color": "bg-muted"},
                ]
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
