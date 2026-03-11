import ccxt
from datetime import datetime
from ai_engine.prediction_engine import PredictionEngine
from ai_engine.indicators import TechnicalIndicators
import pandas as pd

class AnalysisService:
    @staticmethod
    def get_market_analysis(symbol: str):
        """Fetch live ticker and technical indicators using CCXT."""
        exchange = ccxt.binance()
        try:
            # 1. Fetch Ticker for live price
            ticker = exchange.fetch_ticker(symbol)
            
            # 2. Fetch OHLCV for indicators
            ohlcv = exchange.fetch_ohlcv(symbol, timeframe='1h', limit=50)
            df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
            
            indicators = TechnicalIndicators()
            df = indicators.add_rsi(df)
            df = indicators.add_macd(df)
            
            last_row = df.iloc[-1]
            
            return {
                "symbol": symbol,
                "price": ticker['last'],
                "change_24h": ticker['percentage'],
                "indicators": {
                    "rsi": round(float(last_row['rsi']), 2),
                    "macd": "bullish" if last_row['macd'] > last_row['macd_signal'] else "bearish",
                    "volume_score": round(float(ticker['quoteVolume'] / 100000000), 2) # Normalized volume score
                },
                "sentiment": {
                    "score": 0.65, # Real sentiment would require a separate NLP service
                    "label": "Greed" if ticker['percentage'] > 0 else "Fear",
                    "sources": {"binance": "active"}
                }
            }
        except Exception as e:
            print(f"Error fetching real data for {symbol}: {e}")
            return {"error": str(e)}

class SignalsService:
    @staticmethod
    def get_all_signals():
        """Generate real signals using the AI PredictionEngine."""
        engine = PredictionEngine()
        symbols = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'PEPE/USDT']
        signals = []
        
        for i, symbol in enumerate(symbols):
            try:
                prediction = engine.predict(symbol)
                if prediction:
                    signals.append({
                        "id": i + 1,
                        "symbol": symbol,
                        "type": prediction['prediction'].lower(),
                        "strength": round(prediction['confidence'], 2),
                        "confidence": "MOONSHOT" if prediction['confidence'] > 0.85 else "High",
                        "logic": f"AI Engine detected {prediction['prediction']} trend with {int(prediction['confidence']*100)}% accuracy.",
                        "timestamp": prediction['timestamp']
                    })
            except Exception as e:
                print(f"Error generating signal for {symbol}: {e}")
        
        return signals

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
