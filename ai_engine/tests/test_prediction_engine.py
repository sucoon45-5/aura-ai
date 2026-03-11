import pytest
import pandas as pd
import numpy as np
import os
import pickle
from prediction_engine import PredictionEngine

@pytest.fixture
def mock_engine(mocker, tmp_path):
    model_path = os.path.join(tmp_path, 'test_model.pkl')
    engine = PredictionEngine(model_path=model_path)
    
    # Mock data collector to return dummy OHLCV data
    mocker.patch.object(engine.collector, 'fetch_ohlcv', return_value=pd.DataFrame({
        'timestamp': pd.date_range(start='2021-01-01', periods=200, freq='h'),
        'open': np.random.randn(200) + 100,
        'high': np.random.randn(200) + 105,
        'low': np.random.randn(200) + 95,
        'close': np.random.randn(200) + 100,
        'volume': np.random.randn(200) * 1000
    }))
    
    return engine

def test_prepare_data(mock_engine):
    df = mock_engine.collector.fetch_ohlcv('BTC/USDT')
    prepared_df = mock_engine.prepare_data(df)
    
    assert 'target' in prepared_df.columns
    assert 'rsi' in prepared_df.columns
    assert prepared_df.isnull().sum().sum() == 0

def test_train_and_predict(mock_engine):
    # Test training
    success = mock_engine.train('BTC/USDT')
    assert success is True
    assert os.path.exists(mock_engine.model_path)
    
    # Test prediction
    result = mock_engine.predict('BTC/USDT')
    assert result is not None
    assert 'prediction' in result
    assert result['prediction'] in ['BUY', 'SELL']
    assert 0 <= result['confidence'] <= 1
