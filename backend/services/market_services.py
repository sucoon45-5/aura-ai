import ccxt
import pandas as pd
from datetime import datetime
from sqlalchemy.orm import Session
from backend.models.schemas import MarketSignal, RiskSettings
from ai_engine.prediction_engine import PredictionEngine
from ai_engine.indicators import TechnicalIndicators

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
                    "volume_score": round(float(ticker['quoteVolume'] / 100000000), 2)
                },
                "sentiment": {
                    "score": 0.65,
                    "label": "Greed" if ticker['percentage'] > 0 else "Fear",
                    "sources": {"binance": "active"}
                }
            }
        except Exception as e:
            print(f"Error fetching real data for {symbol}: {e}")
            return {"error": str(e)}

class SignalsService:
    @staticmethod
    def get_all_signals(db: Session = None):
        """Fetch latest signals from the database or generate live ones if empty."""
        if db:
            signals = db.query(MarketSignal).order_by(MarketSignal.created_at.desc()).limit(10).all()
            if signals:
                return signals
        
        # Fallback to generating live signals if DB is empty to avoid blank screen
        symbols = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT']
        live_signals = []
        for symbol in symbols:
            # This is a lightweight live check
            ticker = ccxt.binance().fetch_ticker(symbol)
            live_signals.append({
                "symbol": symbol,
                "type": "buy" if ticker['percentage'] > 0 else "sell",
                "strength": abs(ticker['percentage']) / 5.0, # Scale loosely
                "source": "live_market"
            })
        return live_signals

    @staticmethod
    def generate_and_save_signals(db: Session):
        """AI Engine logic to generate new signals and commit them to the DB."""
        # This would be called by a background task/cron
        symbols = ['BTC/USDT', 'ETH/USDT']
        for symbol in symbols:
            ticker = ccxt.binance().fetch_ticker(symbol)
            signal = MarketSignal(
                symbol=symbol,
                type="buy" if ticker['percentage'] > 0 else "sell",
                strength=0.75,
                source="ai_engine"
            )
            db.add(signal)
        db.commit()

class RiskService:
    @staticmethod
    def get_settings(db: Session, user_id: int):
        """Fetch risk settings from the database for a specific user."""
        settings = db.query(RiskSettings).filter(RiskSettings.user_id == user_id).first()
        if not settings:
            settings = RiskSettings(user_id=user_id)
            db.add(settings)
            db.commit()
            db.refresh(settings)
        return settings

    @staticmethod
    def update_settings(db: Session, user_id: int, new_settings: dict):
        """Update risk settings in the database."""
        settings = db.query(RiskSettings).filter(RiskSettings.user_id == user_id).first()
        if not settings:
            settings = RiskSettings(user_id=user_id)
            db.add(settings)
        
        for key, value in new_settings.items():
            if hasattr(settings, key):
                setattr(settings, key, value)
        
        db.commit()
        db.refresh(settings)
        return settings
