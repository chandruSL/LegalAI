from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, users, cases, ai

# Create Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Legal Assistance Platform API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(cases.router)
app.include_router(ai.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Legal Assistance Platform API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
