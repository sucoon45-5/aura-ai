import ccxt
import pandas as pd
from datetime import datetime
import time

class DataCollector:
    def __init__(self, exchange_id='binance'):
        self.exchange = getattr(ccxt, exchange_id)({
            'enableRateLimit': True,
        })

    def fetch_ohlcv(self, symbol='BTC/USDT', timeframe='1h', limit=100):
        """
        Fetch historical OHLCV data from the exchange.
        """
        try:
            ohlcv = self.exchange.fetch_ohlcv(symbol, timeframe, limit=limit)
            df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
            df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
            return df
        except Exception as e:
            print(f"Error fetching data: {e}")
            return None

    def get_realtime_price(self, symbol='BTC/USDT'):
        """
        Fetch the latest price for a symbol.
        """
        try:
            ticker = self.exchange.fetch_ticker(symbol)
            return ticker['last']
        except Exception as e:
            print(f"Error fetching real-time price: {e}")
            return None

if __name__ == "__main__":
    collector = DataCollector()
    data = collector.fetch_ohlcv('BTC/USDT', '1h', 10)
    if data is not None:
        print(data.tail())
