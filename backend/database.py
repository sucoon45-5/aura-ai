from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.core.config import settings

# Create the engine
# For production (PostgreSQL), make sure the DATABASE_URL is set correctly in .env
engine = create_engine(
    settings.DATABASE_URL,
    # pool_pre_ping=True checks connection health before use (crucial for Render/Heroku)
    pool_pre_ping=True,
    # pool_recycle=3600 prevents stale connections by recycling them hourly
    pool_recycle=3600,
    # SSL configuration for production (PostgreSQL)
    # Render's external database URL requires sslmode=require
    connect_args={
        "check_same_thread": False
    } if "sqlite" in settings.DATABASE_URL else {
        "sslmode": "require"
    }
)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
