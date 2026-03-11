import pandas as pd
import numpy as np

class TechnicalIndicators:
    @staticmethod
    def add_sma(df, window=20):
        df[f'sma_{window}'] = df['close'].rolling(window=window).mean()
        return df

    @staticmethod
    def add_rsi(df, window=14):
        delta = df['close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
        
        rs = gain / loss
        df['rsi'] = 100 - (100 / (1 + rs))
        return df

    @staticmethod
    def add_macd(df, fast=12, slow=26, signal=9):
        exp1 = df['close'].ewm(span=fast, adjust=False).mean()
        exp2 = df['close'].ewm(span=slow, adjust=False).mean()
        df['macd'] = exp1 - exp2
        df['macd_signal'] = df['macd'].ewm(span=signal, adjust=False).mean()
        df['macd_hist'] = df['macd'] - df['macd_signal']
        return df

    @staticmethod
    def add_bollinger_bands(df, window=20, num_std=2):
        rolling_mean = df['close'].rolling(window=window).mean()
        rolling_std = df['close'].rolling(window=window).std()
        df['bb_upper'] = rolling_mean + (rolling_std * num_std)
        df['bb_lower'] = rolling_mean - (rolling_std * num_std)
        return df

if __name__ == "__main__":
    # Example usage with dummy data
    data = {'close': [100, 102, 104, 103, 105, 107, 106, 108, 110, 112]}
    df = pd.DataFrame(data)
    ti = TechnicalIndicators()
    df = ti.add_sma(df, 5)
    print(df)
