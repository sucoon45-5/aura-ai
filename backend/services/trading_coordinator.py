import time
from backend.services.execution_engine import ExecutionEngine
from backend.services.risk_manager import RiskManager
from ai_engine.prediction_engine import PredictionEngine
from ai_engine.sentiment_analyzer import SentimentAnalyzer

class TradingCoordinator:
    def __init__(self, user_id, api_key=None, api_secret=None):
        self.user_id = user_id
        self.execution_engine = ExecutionEngine(api_key=api_key, api_secret=api_secret)
        self.risk_manager = RiskManager()
        self.prediction_engine = PredictionEngine()
        self.sentiment_analyzer = SentimentAnalyzer()
        self.is_auto_trading = False

    def toggle_auto_trading(self, status: bool):
        self.is_auto_trading = status
        print(f"Auto Trading {'Enabled' if status else 'Disabled'} for User {self.user_id}")

    def run_cycle(self, symbol='BTC/USDT'):
        """
        A single trading cycle: Scan -> Predict -> Validate -> Execute.
        """
        if not self.is_auto_trading:
            return "Auto trading is OFF."

        print(f"Starting trading cycle for {symbol}...")

        # 1. Get AI Prediction
        prediction = self.prediction_engine.predict(symbol)
        if not prediction or prediction['confidence'] < 0.7:
            return "No high-confidence signal found."

        # 2. Check Meme Coin Sentiment if applicable
        if 'PEPE' in symbol or 'DOGE' in symbol:
            sentiment = self.sentiment_analyzer.analyze_meme_coin(symbol.split('/')[0])
            if sentiment['risk_level'] == 'DANGER':
                return f"Trade rejected: {symbol} sentiment is too risky ({sentiment['risk_level']})."

        # 3. Risk Management Check
        # Example values for validation
        portfolio_value = 10000 # Mock value
        trade_amount = 100 # Mock value
        current_daily_loss = 50 # Mock value
        
        valid, message = self.risk_manager.validate_trade(portfolio_value, trade_amount, current_daily_loss)
        if not valid:
            return f"Trade rejected: {message}"

        # 4. Execute Trade
        side = 'buy' if prediction['prediction'] == 'BUY' else 'sell'
        print(f"Executing {side.upper()} order for {symbol} with confidence {prediction['confidence']}")
        
        # In a real scenario, this would call the execution engine
        # self.execution_engine.place_order(symbol, 'market', side, amount=0.001)
        
        return f"Successfully executed {side} on {symbol}."

if __name__ == "__main__":
    coordinator = TradingCoordinator(user_id=1)
    coordinator.toggle_auto_trading(True)
    print(coordinator.run_cycle('BTC/USDT'))
