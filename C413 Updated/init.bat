@echo off
echo ==========================================
echo Initializing Legal Assistance Platform...
echo ==========================================

echo.
echo [1/4] Setting up Backend Virtual Environment...
cd backend
if not exist venv (
    python -m venv venv
    echo Virtual environment created.
) else (
    echo Virtual environment already exists.
)

echo.
echo [2/4] Installing Backend Dependencies...
call venv\Scripts\activate
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies.
    pause
    exit /b %errorlevel%
)
deactivate
cd ..

echo.
echo [3/4] Installing Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies.
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo ==========================================
echo Initialization Complete!
echo You can now run the app using 'run.bat'
echo ==========================================
pause
