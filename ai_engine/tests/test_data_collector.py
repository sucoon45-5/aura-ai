import pytest
from data_collector import DataCollector
import pandas as pd

def test_fetch_ohlcv_mock(mocker):
    # Mock CCXT exchange
    mock_exchange = mocker.patch('ccxt.binance')
    mock_instance = mock_exchange.return_value
    mock_instance.fetch_ohlcv.return_value = [
        [1609459200000, 29000, 29500, 28000, 29200, 100],
        [1609462800000, 29200, 30000, 29100, 29800, 150]
    ]
    
    collector = DataCollector(exchange_id='binance')
    df = collector.fetch_ohlcv('BTC/USDT', '1h', limit=2)
    
    assert df is not None
    assert len(df) == 2
    assert df['close'].iloc[1] == 29800
    assert df['volume'].iloc[1] == 150
    assert 'timestamp' in df.columns
    assert isinstance(df['timestamp'].iloc[0], pd.Timestamp)

def test_get_realtime_price_mock(mocker):
    mock_exchange = mocker.patch('ccxt.binance')
    mock_instance = mock_exchange.return_value
    mock_instance.fetch_ticker.return_value = {'last': 50000}
    
    collector = DataCollector(exchange_id='binance')
    price = collector.get_realtime_price('BTC/USDT')
    
    assert price == 50000
