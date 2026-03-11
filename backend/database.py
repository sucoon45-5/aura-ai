from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.core.config import settings

# Create the engine
# For production (PostgreSQL), make sure the DATABASE_URL is set correctly in .env
engine = create_engine(
    settings.DATABASE_URL,
    # "check_same_thread" is only needed for SQLite
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
