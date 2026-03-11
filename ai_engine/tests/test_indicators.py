import pandas as pd
import numpy as np
import pytest
from indicators import TechnicalIndicators

@pytest.fixture
def sample_data():
    return pd.DataFrame({
        'close': [10, 11, 12, 11, 10, 9, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
    })

def test_add_sma(sample_data):
    df = TechnicalIndicators.add_sma(sample_data, window=5)
    assert 'sma_5' in df.columns
    assert pd.isna(df['sma_5'].iloc[3])
    assert not pd.isna(df['sma_5'].iloc[4])
    assert df['sma_5'].iloc[4] == sum([10, 11, 12, 11, 10]) / 5

def test_add_rsi(sample_data):
    df = TechnicalIndicators.add_rsi(sample_data, window=5)
    assert 'rsi' in df.columns
    # Check if RSI is within 0-100 range
    non_na_rsi = df['rsi'].dropna()
    assert all(non_na_rsi >= 0) and all(non_na_rsi <= 100)

def test_add_macd(sample_data):
    df = TechnicalIndicators.add_macd(sample_data)
    assert 'macd' in df.columns
    assert 'macd_signal' in df.columns
    assert 'macd_hist' in df.columns

def test_add_bollinger_bands(sample_data):
    df = TechnicalIndicators.add_bollinger_bands(sample_data, window=5)
    assert 'bb_upper' in df.columns
    assert 'bb_lower' in df.columns
    assert all(df['bb_upper'].dropna() >= df['bb_lower'].dropna())
