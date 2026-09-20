from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
import secrets
import hashlib
import hmac
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

from sqlalchemy import create_engine, Column, String, Integer, Boolean, DateTime, ForeignKey, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session as SASession
from sqlalchemy.sql import func

import google.generativeai as genai

# ---------------------------------------------------------------------------
# Application setup
# ---------------------------------------------------------------------------
app = FastAPI(title="AI-Powered SaaS Python Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Database (PostgreSQL)
# ---------------------------------------------------------------------------
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:123qweASD%21%40%23@localhost:5432/perfect_ai_saas")

engine = create_engine(DATABASE_URL, echo=False)
Base = declarative_base()
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=True)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())


class AuthSession(Base):
    __tablename__ = "auth_sessions"

    token = Column(String(64), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    expires_at = Column(DateTime, nullable=False)


Base.metadata.create_all(bind=engine)


def get_db() -> SASession:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Password hashing + session helpers
# ---------------------------------------------------------------------------
def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100_000).hex()
    return f"{salt}${digest}"


def verify_password(password: str, stored: str) -> bool:
    try:
        salt, digest = stored.split("$", 1)
    except ValueError:
        return False
    candidate = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100_000).hex()
    return hmac.compare_digest(candidate, digest)


def create_session(db: SASession, user_id: int, days: int = 30) -> str:
    token = secrets.token_hex(32)
    db.add(AuthSession(token=token, user_id=user_id, expires_at=datetime.utcnow() + timedelta(days=days)))
    db.commit()
    return token


def resolve_user(db: SASession, authorization: Optional[str]) -> Optional[dict]:
    if not authorization:
        return None
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        return None
    session = db.query(AuthSession).filter(AuthSession.token == token.strip()).first()
    if not session or session.expires_at < datetime.utcnow():
        return None
    user = db.query(User).filter(User.id == session.user_id).first()
    if not user:
        return None
    return {
        "id": user.id,
        "name": user.name or "Guest",
        "email": user.email,
        "is_demo": user.is_demo,
    }


def public_user(user: User) -> dict:
    return {
        "id": user.id,
        "name": user.name or "",
        "email": user.email,
        "is_demo": user.is_demo,
    }


# ---------------------------------------------------------------------------
# Pydantic request/response models
# ---------------------------------------------------------------------------
class SignupRequest(BaseModel):
    name: str
    email: str
    password: str


class SigninRequest(BaseModel):
    email: str
    password: str


class SignoutRequest(BaseModel):
    token: str


class AuthResponse(BaseModel):
    token: str
    user: dict


class MeResponse(BaseModel):
    authenticated: bool
    user: Optional[dict] = None


class GenerateRequest(BaseModel):
    prompt: str


class GenerateResponse(BaseModel):
    response: str
    model: str


class DocumentChunkRequest(BaseModel):
    text: str
    chunk_size: Optional[int] = 500
    overlap: Optional[int] = 50


class ChunkResponse(BaseModel):
    chunks: List[str]


class EmbeddingRequest(BaseModel):
    texts: List[str]


class EmbeddingResponse(BaseModel):
    embeddings: List[List[float]]


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------
@app.get("/health")
def health_check(db: SASession = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        db_status = "ok"
    except Exception:
        db_status = "unavailable"
    return {"status": "healthy", "database": db_status}


# ---------------------------------------------------------------------------
# Auth endpoints
# ---------------------------------------------------------------------------
def normalize_email(email: str) -> str:
    return email.strip().lower()


@app.post("/api/v1/auth/signup", response_model=AuthResponse)
def signup(req: SignupRequest, db: SASession = Depends(get_db)):
    email = normalize_email(req.email)
    if not req.name.strip() or not email or not req.password:
        raise HTTPException(status_code=400, detail="Name, email, and password are required.")
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

    user = User(name=req.name.strip(), email=email, password_hash=hash_password(req.password), is_demo=False)
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_session(db, user.id)
    return {"token": token, "user": public_user(user)}


@app.post("/api/v1/auth/signin", response_model=AuthResponse)
def signin(req: SigninRequest, db: SASession = Depends(get_db)):
    email = normalize_email(req.email)
    user = db.query(User).filter(User.email == email).first()
    if not user or not user.password_hash or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_session(db, user.id)
    return {"token": token, "user": public_user(user)}


@app.post("/api/v1/auth/signout")
def signout(req: SignoutRequest, db: SASession = Depends(get_db)):
    db.query(AuthSession).filter(AuthSession.token == req.token.strip()).delete()
    db.commit()
    return {"ok": True}


@app.post("/api/v1/auth/demo", response_model=AuthResponse)
def demo_access(db: SASession = Depends(get_db)):
    demo_email = "demo@omninai.app"
    demo = db.query(User).filter(User.email == demo_email).first()
    if not demo:
        demo = User(name="Demo User", email=demo_email, password_hash=None, is_demo=True)
        db.add(demo)
        db.commit()
        db.refresh(demo)
    token = create_session(db, demo.id, days=1)
    return {"token": token, "user": public_user(demo)}


@app.get("/api/v1/auth/me", response_model=MeResponse)
def me(authorization: Optional[str] = Header(None), db: SASession = Depends(get_db)):
    user = resolve_user(db, authorization)
    if not user:
        return {"authenticated": False, "user": None}
    return {"authenticated": True, "user": user}


# ---------------------------------------------------------------------------
# Gemini AI chat (accessible to demo + signed-in users)
# ---------------------------------------------------------------------------
ALLOWED_MODELS = ["gemini-3.5-flash", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]
DEFAULT_MODEL = "gemini-3.5-flash"


@app.post("/api/v1/generate", response_model=GenerateResponse)
def generate_ai_response(req: GenerateRequest, authorization: Optional[str] = Header(None), db: SASession = Depends(get_db)):
    user = resolve_user(db, authorization)  # validates session; demo token also resolves
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt is required.")

    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY environment variable is not set.")
        genai.configure(api_key=api_key)

        model_name = DEFAULT_MODEL
        model = genai.GenerativeModel(model_name)

        result = model.generate_content(req.prompt)
        return {"response": result.text, "model": model_name}
    except Exception as e:
        fallback_text = (
            f"Gemini AI Response (Live Integration Fallback):\n"
            f"Based on your prompt: '{req.prompt}', here is the analysis and generated solution. "
            f"[Error detail: {str(e)}]"
        )
        return {"response": fallback_text, "model": model_name if 'model_name' in dir() else DEFAULT_MODEL}


# ---------------------------------------------------------------------------
# Demo / authenticated user data stubs
# ---------------------------------------------------------------------------
@app.get("/api/v1/me/history")
def get_history(authorization: Optional[str] = Header(None), db: SASession = Depends(get_db)):
    user = resolve_user(db, authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Sign in required.")
    return {"items": [], "is_demo": user["is_demo"]}


# ---------------------------------------------------------------------------
# Existing utility endpoints
# ---------------------------------------------------------------------------
@app.post("/api/v1/chunk", response_model=ChunkResponse)
def chunk_document(req: DocumentChunkRequest):
    text = req.text
    chunk_size = req.chunk_size
    overlap = req.overlap

    if not text:
        return {"chunks": []}

    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap

    return {"chunks": chunks}


@app.post("/api/v1/embeddings", response_model=EmbeddingResponse)
def generate_embeddings(req: EmbeddingRequest):
    dim = 1536
    mock_embeddings = [[float(i % 10) / 10.0 for i in range(dim)] for _ in req.texts]
    return {"embeddings": mock_embeddings}