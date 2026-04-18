import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from app.routers import career_os

app = FastAPI(
    title="TulasiAI Labs Anti-Layoff OS API",
    description="Backend engine for dual-persona skill progression and predictive career risk tracking.",
    version="2.0.0",
)

# Configure CORS for Next.js isolated testing ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:4444", "https://tulasi-ai-labs.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include primary OS routers
app.include_router(career_os.router, prefix="/api/v1")

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "status_code": exc.status_code}
    )

@app.get("/")
async def root():
    return JSONResponse({
        "status": "online",
        "engine": "TulasiAI Real Data Hub",
        "endpoints": "/docs"
    })

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
