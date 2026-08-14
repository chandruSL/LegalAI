from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base

class UserRole(str, enum.Enum):
    CLIENT = "client"
    LAWYER = "lawyer"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)  # Stored as string, validated via enum in Pydantic
    created_at = Column(DateTime, default=datetime.utcnow)

    # Lawyer Profile Fields
    hourly_fee = Column(Integer, nullable=True)
    specialization = Column(String, nullable=True)
    rating = Column(Integer, nullable=True) # 0-5 stars
    success_rate = Column(Integer, nullable=True) # 0-100 percentage
    
    # For Clients: Who is their lawyer?
    linked_lawyer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relationships
    linked_lawyer = relationship("User", remote_side=[id], backref="linked_clients")
    client_cases = relationship("Case", foreign_keys="[Case.client_id]", back_populates="client")
    lawyer_cases = relationship("Case", foreign_keys="[Case.lawyer_id]", back_populates="lawyer")

class CaseStatus(str, enum.Enum):
    OPEN = "open"
    CLOSED = "closed"
    PENDING = "pending"

class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    status = Column(String, default=CaseStatus.OPEN.value)
    prediction_result = Column(Text, nullable=True)
    client_id = Column(Integer, ForeignKey("users.id"))
    lawyer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    client = relationship("User", foreign_keys=[client_id], back_populates="client_cases")
    lawyer = relationship("User", foreign_keys=[lawyer_id], back_populates="lawyer_cases")
    documents = relationship("Document", back_populates="case")

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    file_path = Column(String)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    case_id = Column(Integer, ForeignKey("cases.id"))

    case = relationship("Case", back_populates="documents")
