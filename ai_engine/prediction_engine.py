from datetime import datetime, timezone
import pickle
import os
import pandas as pd
import numpy as np
from xgboost import XGBClassifier
from ai_engine.data_collector import DataCollector
from ai_engine.indicators import TechnicalIndicators

class PredictionEngine:
    def __init__(self, model_path='ai_engine/models/trend_model.pkl'):
        self.model_path = model_path
        self.model = XGBClassifier(n_estimators=100, learning_rate=0.05, max_depth=5)
        self.collector = DataCollector()
        self.indicators = TechnicalIndicators()

    def prepare_data(self, df):
        """
        Add features and labels to the dataframe.
        """
        df = self.indicators.add_sma(df, 20)
        df = self.indicators.add_rsi(df)
        df = self.indicators.add_macd(df)
        df = self.indicators.add_bollinger_bands(df)
        
        # Create labels: 1 if close price increases in the next candle, else 0
        df['target'] = (df['close'].shift(-1) > df['close']).astype(int)
        
        # Drop rows with NaN (from indicators and shift)
        df = df.dropna().reset_index(drop=True)
        return df

    def train(self, symbol='BTC/USDT'):
        """
        Train the model on historical data.
        """
        df = self.collector.fetch_ohlcv(symbol, limit=1000)
        if df is None or len(df) < 100:
            return False
            
        data = self.prepare_data(df)
        features = ['close', 'volume', 'sma_20', 'rsi', 'macd', 'bb_upper', 'bb_lower']
        
        X = data[features]
        y = data['target']
        
        self.model.fit(X, y)
        
        # Save model
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        with open(self.model_path, 'wb') as f:
            pickle.dump(self.model, f)
        
        return True

    def predict(self, symbol='BTC/USDT'):
        """
        Predict the trend for the next candle.
        """
        # The model is loaded in __init__, so no need to check existence here.
        # If the model was just initialized (not loaded), it will be an untrained XGBClassifier.
        # A more robust solution might check if the model has been trained.
        
        df = self.collector.fetch_ohlcv(symbol) # Removed limit=100 as per instruction
        if df is None:
            return None
            
        data = self.prepare_data(df)
        features = ['close', 'volume', 'sma_20', 'rsi', 'macd', 'bb_upper', 'bb_lower']
        
        last_row = data[features].iloc[[-1]]
        prediction = self.model.predict(last_row)[0]
        probability = self.model.predict_proba(last_row)[0][prediction]
        
        return {
            'symbol': symbol,
            'prediction': 'BUY' if prediction == 1 else 'SELL',
            'confidence': float(probability),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }

if __name__ == "__main__":
    engine = PredictionEngine()
    result = engine.predict('BTC/USDT')
    print(result)
