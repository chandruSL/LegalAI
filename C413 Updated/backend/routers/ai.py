from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import database, models, security, ai_utils

router = APIRouter(
    prefix="/ai",
    tags=["ai"],
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@router.post("/chat", response_model=ChatResponse)
def chat_with_legal_bot(
    request: ChatRequest,
    current_user: models.User = Depends(security.get_current_user)
):
    # Determine user role? Maybe tailored response?
    # For now, generic legal bot.
    answer = ai_utils.get_legal_chat_response(request.message)
    return {"response": answer}

@router.post("/predict/{case_id}", response_model=ChatResponse)
def predict_outcome(
    case_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(database.get_db)
):
    # Only Lawyers can request predictions? PRD says users/lawyers, but logic usually implies lawyer analysis.
    # Allowing Lawyers for now as per "Predictions displayed primarily to lawyers".
    
    case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # Permission check
    # Permission check
    if current_user.role == models.UserRole.LAWYER.value and case.lawyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your case")
    if current_user.role == models.UserRole.CLIENT.value and case.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your case")

    # Check Cache
    if case.prediction_result:
        return {"response": case.prediction_result}

    # Find the most recent document
    # Assuming the prediction is on the latest uploaded file
    document = db.query(models.Document).filter(models.Document.case_id == case_id).order_by(models.Document.uploaded_at.desc()).first()
    
    if not document:
        raise HTTPException(status_code=400, detail="No documents found for this case to analyze.")
    
    prediction = ai_utils.predict_case_outcome(document.file_path)
    
    # Cache Result
    case.prediction_result = prediction
    db.commit()
    
    return {"response": prediction}
