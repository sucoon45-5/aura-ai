from datetime import datetime, timedelta
import random

class DashboardService:
    @staticmethod
    def get_portfolio_stats():
        return {
            "portfolio_value": 128430.50 + random.uniform(-100, 100),
            "total_profit_24h": 4520.00 + random.uniform(-50, 50),
            "active_trades": random.randint(10, 15),
            "ai_confidence_avg": 84,
            "trend": "up"
        }

    @staticmethod
    def get_performance_data():
        # Generate last 7 days of performance
        data = []
        base_value = 100000
        for i in range(7):
            date = (datetime.now() - timedelta(days=7-i)).strftime("%Y-%m-%d")
            base_value += random.uniform(500, 2000)
            data.append({"date": date, "value": base_value})
        return data

    @staticmethod
    def get_active_trades():
        return [
            {"symbol": "BTC/USDT", "side": "buy", "entry": 64230, "current": 65120, "pnl": 1.38, "status": "Active"},
            {"symbol": "ETH/USDT", "side": "sell", "entry": 3450, "current": 3320, "pnl": 3.76, "status": "Active"},
            {"symbol": "SOL/USDT", "side": "buy", "entry": 142.50, "current": 148.90, "pnl": 4.49, "status": "Active"},
            {"symbol": "PEPE/USDT", "side": "buy", "entry": 0.0000084, "current": 0.0000092, "pnl": 9.52, "status": "MOONSHOT"},
        ]
