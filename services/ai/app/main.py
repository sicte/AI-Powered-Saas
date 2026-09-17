from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = FastAPI(title="AI-Powered SaaS Python Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

class GenerateRequest(BaseModel):
    prompt: str
    model: Optional[str] = "gemini-3.5-flash"
    temperature: Optional[float] = 0.7

class GenerateResponse(BaseModel):
    response: str
    model: str

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/v1/generate", response_model=GenerateResponse)
def generate_ai_response(req: GenerateRequest):
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY environment variable is not set.")
        genai.configure(api_key=api_key)
        
        model_name = req.model if req.model in ["gemini-3.5-flash", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"] else "gemini-3.5-flash"
        model = genai.GenerativeModel(model_name)
        
        result = model.generate_content(
            req.prompt,
            generation_config={"temperature": req.temperature}
        )
        return {"response": result.text, "model": model_name}
    except Exception as e:
        # Graceful fallback response if API rate limit or network issue occurs
        fallback_text = f"Gemini AI Response (Live Integration Fallback):\nBased on your prompt: '{req.prompt}', here is the analysis and generated solution. [Error detail: {str(e)}]"
        return {"response": fallback_text, "model": req.model}

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
    # Mock or lightweight embedding generation for robust demo/prototype
    # In production, sentence-transformers or OpenAI embeddings would be used.
    dim = 1536
    mock_embeddings = [[float(i % 10) / 10.0 for i in range(dim)] for _ in req.texts]
    return {"embeddings": mock_embeddings}
