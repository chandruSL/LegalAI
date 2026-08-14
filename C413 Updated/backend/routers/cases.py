from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
import database, models, schemas, security
import os
import shutil

router = APIRouter(
    prefix="/cases",
    tags=["cases"],
)

UPLOAD_DIR = "uploads"

@router.post("/", response_model=schemas.CaseResponse)
def create_case(
    case: schemas.CaseCreate,
    client_id: Optional[int] = None, # Used if Lawyer creates case for a client
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(database.get_db)
):
    final_client_id = current_user.id
    final_lawyer_id = None

    if current_user.role == models.UserRole.CLIENT.value:
        final_client_id = current_user.id
        final_lawyer_id = current_user.linked_lawyer_id
    elif current_user.role == models.UserRole.LAWYER.value:
        if not client_id:
            raise HTTPException(status_code=400, detail="Lawyer must specify client_id")
        # Verify client is linked ?? Or just exist
        # For simplicity, assuming lawyer can create case for any user or just linked
        final_client_id = client_id
        final_lawyer_id = current_user.id
    
    new_case = models.Case(
        title=case.title,
        description=case.description,
        client_id=final_client_id,
        lawyer_id=final_lawyer_id,
        status=models.CaseStatus.OPEN.value
    )
    db.add(new_case)
    db.commit()
    db.refresh(new_case)
    return new_case

@router.get("/", response_model=List[schemas.CaseResponse])
def read_cases(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(database.get_db)
):
    if current_user.role == models.UserRole.CLIENT.value:
        return db.query(models.Case).filter(models.Case.client_id == current_user.id).all()
    elif current_user.role == models.UserRole.LAWYER.value:
        return db.query(models.Case).filter(models.Case.lawyer_id == current_user.id).all()
    return []

@router.post("/{case_id}/documents", response_model=schemas.DocumentResponse)
def upload_document(
    case_id: int,
    file: UploadFile = File(...),
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(database.get_db)
):
    case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # Access Control
    if current_user.role == models.UserRole.CLIENT.value and case.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your case")
    if current_user.role == models.UserRole.LAWYER.value and case.lawyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your assigned case")
    
    # Save File
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)

    file_location = os.path.join(UPLOAD_DIR, f"{case_id}_{file.filename}")
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    new_doc = models.Document(
        filename=file.filename,
        file_path=file_location,
        case_id=case_id
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return new_doc

@router.delete("/{case_id}/documents/{document_id}")
def delete_document(
    case_id: int,
    document_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(database.get_db)
):
    # Fetch document
    doc = db.query(models.Document).filter(models.Document.id == document_id, models.Document.case_id == case_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Fetch Case for Access Control
    case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if not case:
         raise HTTPException(status_code=404, detail="Case not found")

    # Access Control
    if current_user.role == models.UserRole.CLIENT.value and case.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your case")
    if current_user.role == models.UserRole.LAWYER.value and case.lawyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your assigned case")

    # Delete file from disk
    if os.path.exists(doc.file_path):
        os.remove(doc.file_path)

    # Delete from DB
    db.delete(doc)
    db.commit()

    return {"message": "Document deleted successfully"}
