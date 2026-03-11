import pytest
from services.risk_manager import RiskManager

@pytest.fixture
def risk_manager():
    return RiskManager(daily_loss_limit=0.05, max_position_size=0.1)

def test_validate_trade_success(risk_manager):
    # Portfolio: 10000, Trade: 500 (5%), Daily Loss: 100 (1%)
    # Limits: 10% pos size ($1000), 5% daily loss ($500)
    valid, message = risk_manager.validate_trade(10000, 500, 100)
    assert valid is True
    assert "validated" in message

def test_validate_trade_daily_loss_limit(risk_manager):
    # Daily loss: 600 (6%) - Limit: 500 (5%)
    valid, message = risk_manager.validate_trade(10000, 100, 600)
    assert valid is False
    assert "Daily loss limit reached" in message

def test_validate_trade_max_position_size(risk_manager):
    # Trade: 1500 (15%) - Limit: 1000 (10%)
    valid, message = risk_manager.validate_trade(10000, 1500, 0)
    assert valid is False
    assert "Trade amount exceeds max position size" in message

def test_calculate_sl_tp_buy(risk_manager):
    sl, tp = risk_manager.calculate_sl_tp(100, 'buy', sl_percent=0.02, tp_percent=0.05)
    assert sl == 98
    assert tp == 105

def test_calculate_sl_tp_sell(risk_manager):
    sl, tp = risk_manager.calculate_sl_tp(100, 'sell', sl_percent=0.02, tp_percent=0.05)
    assert sl == 102
    assert tp == 95
