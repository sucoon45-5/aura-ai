from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import auth, keys
from backend.services.dashboard_service import DashboardService
from backend.services.market_services import AnalysisService, SignalsService, RiskService
from backend.database import engine, get_db
from backend.models import schemas
from backend.services.trading_coordinator import TradingCoordinator
from ai_engine.prediction_engine import PredictionEngine
from backend.core.config import get_current_user

# Create database tables
schemas.Base.metadata.create_all(bind=engine)

# Initialize engines
prediction_engine = PredictionEngine()
# We'll use a dictionary to store coordinators by user_id for now
coordinators = {}

app = FastAPI(title="Aura AI API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth.router)
app.include_router(keys.router)

@app.get("/")
def read_root():
    return {"message": "Aura AI API is running"}

@app.get("/api/dashboard/stats")
async def get_stats(current_user: str = Depends(get_current_user)):
    return DashboardService.get_portfolio_stats()

@app.get("/api/dashboard/performance")
async def get_performance(current_user: str = Depends(get_current_user)):
    return DashboardService.get_performance_data()

@app.get("/api/dashboard/trades")
async def get_trades(current_user: str = Depends(get_current_user)):
    return DashboardService.get_active_trades()

@app.get("/api/analysis/{symbol}")
async def get_analysis(symbol: str, current_user: str = Depends(get_current_user)):
    return AnalysisService.get_market_analysis(symbol)

@app.get("/api/signals")
async def get_signals(current_user: str = Depends(get_current_user)):
    return SignalsService.get_all_signals()

@app.get("/api/risk/settings")
async def get_risk_settings(current_user: str = Depends(get_current_user)):
    return RiskService.get_settings()

@app.post("/api/risk/settings")
async def update_risk_settings(settings: dict, current_user: str = Depends(get_current_user)):
    return RiskService.update_settings(settings)

# AI & Bot Endpoints
@app.get("/api/ai/predict/{symbol}")
async def get_prediction(symbol: str, current_user: str = Depends(get_current_user)):
    """Get real-time AI prediction for a symbol."""
    # Ensure symbol format (e.g., BTC-USDT to BTC/USDT if needed)
    symbol = symbol.replace("-", "/")
    return prediction_engine.predict(symbol)

@app.get("/api/bot/status/{user_id}")
async def get_bot_status(user_id: int, current_user: str = Depends(get_current_user)):
    """Get the auto-trading status for a user."""
    if user_id not in coordinators:
        coordinators[user_id] = TradingCoordinator(user_id=user_id)
    return {"user_id": user_id, "is_auto_trading": coordinators[user_id].is_auto_trading}

@app.post("/api/bot/toggle/{user_id}")
async def toggle_bot(user_id: int, status: bool, current_user: str = Depends(get_current_user)):
    """Enable or disable auto-trading for a user."""
    if user_id not in coordinators:
        coordinators[user_id] = TradingCoordinator(user_id=user_id)
    coordinators[user_id].toggle_auto_trading(status)
    return {"message": f"Bot {'started' if status else 'stopped'}", "status": status}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
