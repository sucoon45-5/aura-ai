from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    api_keys = relationship("APIKey", back_populates="user")
    trades = relationship("Trade", back_populates="user")

class APIKey(Base):
    __tablename__ = "api_keys"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    exchange = Column(String, nullable=False) # e.g., 'binance', 'bybit', 'metatrader'
    api_key_encrypted = Column(String, nullable=False)
    api_secret_encrypted = Column(String, nullable=False)
    passphrase_encrypted = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    
    user = relationship("User", back_populates="api_keys")

class Trade(Base):
    __tablename__ = "trades"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    symbol = Column(String, nullable=False) # e.g., 'BTC/USDT', 'EURUSD'
    side = Column(String, nullable=False)   # 'buy' or 'sell'
    entry_price = Column(Float, nullable=False)
    exit_price = Column(Float, nullable=True)
    amount = Column(Float, nullable=False)
    stop_loss = Column(Float, nullable=True)
    take_profit = Column(Float, nullable=True)
    status = Column(String, default="open") # 'open', 'closed', 'canceled'
    pnl = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    closed_at = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="trades")

class MarketSignal(Base):
    __tablename__ = "market_signals"
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, nullable=False, index=True)
    type = Column(String, nullable=False) # 'buy', 'sell', 'hold'
    strength = Column(Float, nullable=False) # 0.0 to 1.0
    indicators = Column(JSON, nullable=True) # e.g., {"rsi": 30, "macd": "bullish"}
    source = Column(String, nullable=False) # 'ai_engine', 'manual'
    created_at = Column(DateTime, default=datetime.utcnow)

class MemeCoinAlert(Base):
    __tablename__ = "meme_coin_alerts"
    id = Column(Integer, primary_key=True, index=True)
    token_name = Column(String, nullable=False)
    symbol = Column(String, nullable=False)
    network = Column(String, nullable=False) # 'solana', 'eth', 'base'
    sentiment_score = Column(Float, nullable=False)
    volume_24h = Column(Float, nullable=True)
    risk_level = Column(String, nullable=False) # 'low', 'medium', 'high', 'moonshot'
    created_at = Column(DateTime, default=datetime.utcnow)
