from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.core.config import settings

# Create the engine
# For production (PostgreSQL), make sure the DATABASE_URL is set correctly in .env
try:
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=3600,
        connect_args={
            "check_same_thread": False
        } if "sqlite" in settings.DATABASE_URL else {
            "sslmode": "require"
        }
    )
    # Test connection immediately to catch errors early in logs
    with engine.connect() as conn:
        print("DATABASE SUCCESS: Successfully connected to the database!")
except Exception as e:
    print(f"!!! DATABASE ERROR !!!")
    print(f"Error Type: {type(e).__name__}")
    print(f"Error Details: {str(e)}")
    # Re-raise so the app still fails but we see why
    raise e

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
