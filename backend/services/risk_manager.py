from datetime import datetime

class RiskManager:
    def __init__(self, daily_loss_limit=0.05, max_position_size=0.1):
        self.daily_loss_limit = daily_loss_limit # 5% daily loss limit
        self.max_position_size = max_position_size # 10% of portfolio per trade
        self.daily_pnl = 0.0

    def validate_trade(self, portfolio_value, trade_amount, current_daily_loss):
        """
        Check if a trade complies with risk management rules.
        """
        # Rule 1: Daily loss limit
        if current_daily_loss >= (portfolio_value * self.daily_loss_limit):
            return False, "Daily loss limit reached. Trading halted."

        # Rule 2: Max position size
        if trade_amount > (portfolio_value * self.max_position_size):
            return False, f"Trade amount exceeds max position size of {self.max_position_size * 100}%."

        return True, "Trade validated."

    def calculate_sl_tp(self, entry_price, side, sl_percent=0.02, tp_percent=0.05):
        """
        Calculate suggested Stop Loss and Take Profit levels.
        """
        if side == 'buy':
            sl = entry_price * (1 - sl_percent)
            tp = entry_price * (1 + tp_percent)
        else:
            sl = entry_price * (1 + sl_percent)
            tp = entry_price * (1 - tp_percent)
            
        return round(sl, 6), round(tp, 6)

    def monitor_open_trades(self, open_trades):
        """
        Iterate through open trades and check for exit conditions.
        """
        signals_to_close = []
        for trade in open_trades:
            # Logic to check current price vs SL/TP
            pass
        return signals_to_close
