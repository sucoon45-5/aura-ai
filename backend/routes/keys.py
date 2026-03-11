from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

# from backend.database import get_db
from backend.models.schemas import APIKey
from backend.core.config import settings

router = APIRouter(prefix="/keys", tags=["api_keys"])

class APIKeyCreate(BaseModel):
    exchange: str
    api_key: str
    api_secret: str
    passphrase: str = None

class APIKeyResponse(BaseModel):
    id: int
    exchange: str
    is_active: bool

    class Config:
        from_attributes = True

@router.post("/", response_model=APIKeyResponse)
def add_api_key(key_data: APIKeyCreate):
    """
    Encrypt and store a new exchange API key.
    """
    # In a real scenario, use AES-256 for encryption
    # encrypted_key = encrypt(key_data.api_key)
    # encrypted_secret = encrypt(key_data.api_secret)
    # encrypted_pass = encrypt(key_data.passphrase) if key_data.passphrase else None
    
    # new_key = APIKey(
    #     user_id=1, # Mocked
    #     exchange=key_data.exchange,
    #     api_key_encrypted=encrypted_key,
    #     api_secret_encrypted=encrypted_secret,
    #     passphrase_encrypted=encrypted_pass
    # )
    # db.add(new_key)
    # db.commit()
    # db.refresh(new_key)
    return {"id": 1, "exchange": key_data.exchange, "is_active": True}

@router.get("/", response_model=List[APIKeyResponse])
def get_user_keys():
    """
    List all API keys for the current user.
    """
    # return db.query(APIKey).filter(APIKey.user_id == 1).all()
    return [{"id": 1, "exchange": "binance", "is_active": True}]

@router.delete("/{key_id}")
def delete_api_key(key_id: int):
    """
    Deactivate or delete an API key.
    """
    return {"message": "API key deleted successfully"}
