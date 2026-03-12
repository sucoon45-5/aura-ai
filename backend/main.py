from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
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

from backend.models.schemas import User as DBUser
from backend.models.schemas import APIKey as DBAPIKey

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    user = db.query(DBUser).filter(DBUser.email == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    api_keys = db.query(DBAPIKey).filter(DBAPIKey.user_id == user.id, DBAPIKey.is_active == True).all()
    return DashboardService.get_portfolio_stats(api_keys)

@app.get("/api/dashboard/performance")
async def get_performance(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    user = db.query(DBUser).filter(DBUser.email == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return DashboardService.get_performance_data(db, user.id)

@app.get("/api/dashboard/trades")
async def get_active_trades(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    user = db.query(DBUser).filter(DBUser.email == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return DashboardService.get_active_trades(db, user.id)

@app.get("/api/analysis/{symbol}")
async def get_analysis(symbol: str, current_user: str = Depends(get_current_user)):
    return AnalysisService.get_market_analysis(symbol)

@app.get("/api/signals")
async def get_signals(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    return SignalsService.get_all_signals(db)

from backend.models.schemas import User as DBUser

@app.get("/api/risk/settings")
async def get_risk_settings(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    user = db.query(DBUser).filter(DBUser.email == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return RiskService.get_settings(db, user.id)

@app.post("/api/risk/settings")
async def update_risk_settings(settings: dict, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    user = db.query(DBUser).filter(DBUser.email == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return RiskService.update_settings(db, user.id, settings)

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
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
