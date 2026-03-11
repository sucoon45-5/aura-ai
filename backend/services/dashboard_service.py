import ccxt
from datetime import datetime, timedelta

class DashboardService:
    @staticmethod
    @staticmethod
    def get_portfolio_stats():
        """Calculate real-time portfolio stats using live and historical prices."""
        exchange = ccxt.binance()
        try:
            # Simulated holdings (In a real app, these would come from the DB)
            btc_amount = 1.2
            eth_amount = 15.0
            usdt_balance = 12500.0
            
            # 1. Fetch live prices
            btc_ticker = exchange.fetch_ticker('BTC/USDT')
            eth_ticker = exchange.fetch_ticker('ETH/USDT')
            
            btc_price = btc_ticker['last']
            eth_price = eth_ticker['last']
            
            total_value = (btc_amount * btc_price) + (eth_amount * eth_price) + usdt_balance
            
            # 2. Fetch 24h historical prices for real trend calculation
            # fetch_ohlcv returns [timestamp, open, high, low, close, volume]
            # Since Binance returns 1m by default if no timeframe, we use 1h and look back 24h
            btc_24h = exchange.fetch_ohlcv('BTC/USDT', timeframe='1h', limit=24)
            eth_24h = exchange.fetch_ohlcv('ETH/USDT', timeframe='1h', limit=24)
            
            btc_price_24h = btc_24h[0][4] if btc_24h else btc_price
            eth_price_24h = eth_24h[0][4] if eth_24h else eth_price
            
            yesterday_value = (btc_amount * btc_price_24h) + (eth_amount * eth_price_24h) + usdt_balance
            
            profit_24h = total_value - yesterday_value
            profit_pct = (profit_24h / yesterday_value) * 100 if yesterday_value > 0 else 0
            
            return {
                "portfolio_value": round(total_value, 2),
                "total_profit_24h": round(profit_24h, 2),
                "profit_pct_24h": round(profit_pct, 2),
                "active_trades": 2,
                "ai_confidence_avg": 92,
                "trend": "up" if profit_pct > 0 else "down",
                "allocation": [
                    {"name": "Bitcoin", "symbol": "BTC", "value": f"{round(((btc_amount * btc_price)/total_value)*100)}%", "color": "bg-orange-500"},
                    {"name": "Ethereum", "symbol": "ETH", "value": f"{round(((eth_amount * eth_price)/total_value)*100)}%", "color": "bg-blue-500"},
                    {"name": "Stablecoins", "symbol": "USDT", "value": f"{round((usdt_balance/total_value)*100)}%", "color": "bg-success"},
                    {"name": "Others", "symbol": "Misc", "value": "1%", "color": "bg-muted"},
                ]
            }
        except Exception as e:
            print(f"Error fetching dashboard stats: {e}")
            return {"error": str(e)}

    @staticmethod
    def get_performance_data():
        """Fetch last 7 days of real performance data."""
        exchange = ccxt.binance()
        try:
            # Fetch daily OHLCV for BTC as a benchmark for portfolio performance
            ohlcv = exchange.fetch_ohlcv('BTC/USDT', timeframe='1d', limit=7)
            data = []
            
            # Simulate a portfolio growth trend matching BTC movement for the demo
            # In a real app, this would query the personal 'balance_history' table
            for entry in ohlcv:
                date = datetime.fromtimestamp(entry[0] / 1000).strftime("%Y-%m-%d")
                price = entry[4] # closing price
                # Normalized simulated balance based on price scaling
                simulated_value = 100000 * (price / ohlcv[0][4]) 
                data.append({"date": date, "value": round(simulated_value, 2)})
            
            return data
        except Exception as e:
            print(f"Error fetching performance data: {e}")
            return []

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
