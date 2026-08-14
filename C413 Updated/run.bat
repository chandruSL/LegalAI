@echo off
echo ==========================================
echo Starting Legal Assistance Platform...
echo ==========================================

echo.
echo Starting Backend (FastAPI)...
start "Backend - Legal Platform" cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload"

echo.
echo Starting Frontend (Next.js)...
start "Frontend - Legal Platform" cmd /k "cd frontend && npm run dev"

echo.
echo Application started!
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:3000
echo.
pause
