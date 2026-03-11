import random
from datetime import datetime, timedelta

class AnalysisService:
    @staticmethod
    def get_market_analysis(symbol: str):
        # Mocking technical analysis data
        return {
            "symbol": symbol,
            "price": 65120.50 if "BTC" in symbol else 3320.10,
            "change_24h": 2.4,
            "indicators": {
                "rsi": random.randint(30, 70),
                "macd": "bullish" if random.random() > 0.5 else "bearish",
                "volume_score": random.uniform(0.1, 1.0)
            },
            "sentiment": {
                "score": 0.72,
                "label": "Greed",
                "sources": {"reddit": "positive", "x": "neutral"}
            }
        }

class SignalsService:
    @staticmethod
    def get_all_signals():
        return [
            {
                "id": 1,
                "symbol": "BTC/USDT",
                "type": "buy",
                "strength": 0.85,
                "confidence": "High",
                "logic": "RSI oversold + MACD crossover on 4H",
                "timestamp": datetime.now().isoformat()
            },
            {
                "id": 2,
                "symbol": "PEPE/USDT",
                "type": "buy",
                "strength": 0.94,
                "confidence": "MOONSHOT",
                "logic": "Viral sentiment surge + whale accumulation",
                "timestamp": (datetime.now() - timedelta(minutes=15)).isoformat()
            }
        ]

class RiskService:
    _settings = {
        "bot_enabled": True,
        "max_daily_loss": 5.0, # percentage
        "default_stop_loss": 2.0,
        "default_take_profit": 6.0,
        "leverage": 10
    }

    @staticmethod
    def get_settings():
        return RiskService._settings

    @staticmethod
    def update_settings(new_settings: dict):
        RiskService._settings.update(new_settings)
        return RiskService._settings
