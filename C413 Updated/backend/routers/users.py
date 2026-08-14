from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import database, models, schemas, security

router = APIRouter(
    prefix="/users",
    tags=["users"],
)

@router.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(security.get_current_user)):
    return current_user

@router.get("/lawyers", response_model=List[schemas.UserResponse])
def read_all_lawyers(
    skip: int = 0, 
    limit: int = 100, 
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(database.get_db)
):
    # Only allow listing lawyers
    lawyers = db.query(models.User).filter(models.User.role == models.UserRole.LAWYER.value).offset(skip).limit(limit).all()
    return lawyers

@router.post("/link/{lawyer_id}")
def link_lawyer(
    lawyer_id: int,
    current_user: models.User = Depends(security.get_current_active_client),
    db: Session = Depends(database.get_db)
):
    # Check if lawyer exists
    lawyer = db.query(models.User).filter(models.User.id == lawyer_id, models.User.role == models.UserRole.LAWYER.value).first()
    if not lawyer:
        raise HTTPException(status_code=404, detail="Lawyer not found")
    
    current_user.linked_lawyer_id = lawyer.id
    db.commit()
    return {"message": f"Successfully linked to lawyer {lawyer.full_name}"}

@router.get("/my-clients", response_model=List[schemas.UserResponse])
def get_my_clients(
    current_user: models.User = Depends(security.get_current_active_lawyer),
    db: Session = Depends(database.get_db)
):
    return current_user.linked_clients
