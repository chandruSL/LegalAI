from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import UserRole

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    linked_lawyer_id: Optional[int] = None
    hourly_fee: Optional[int] = None
    specialization: Optional[str] = None
    rating: Optional[float] = None
    success_rate: Optional[int] = None
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class DocumentResponse(BaseModel):
    id: int
    filename: str
    uploaded_at: datetime

    class Config:
        from_attributes = True

class CaseBase(BaseModel):
    title: str
    description: str

class CaseCreate(CaseBase):
    pass

class CaseResponse(CaseBase):
    id: int
    status: str
    client_id: int
    lawyer_id: Optional[int]
    prediction_result: Optional[str] = None
    created_at: datetime
    documents: List[DocumentResponse] = []

    class Config:
        from_attributes = True

