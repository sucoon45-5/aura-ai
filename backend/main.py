from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import auth, keys
from backend.services.dashboard_service import DashboardService
from backend.services.market_services import AnalysisService, SignalsService, RiskService

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
async def get_stats():
    return DashboardService.get_portfolio_stats()

@app.get("/api/dashboard/performance")
async def get_performance():
    return DashboardService.get_performance_data()

@app.get("/api/dashboard/trades")
async def get_trades():
    return DashboardService.get_active_trades()

@app.get("/api/analysis/{symbol}")
async def get_analysis(symbol: str):
    return AnalysisService.get_market_analysis(symbol)

@app.get("/api/signals")
async def get_signals():
    return SignalsService.get_all_signals()

@app.get("/api/risk/settings")
async def get_risk_settings():
    return RiskService.get_settings()

@app.post("/api/risk/settings")
async def update_risk_settings(settings: dict):
    return RiskService.update_settings(settings)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
