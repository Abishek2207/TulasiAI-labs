#!/usr/bin/env python3
"""
TulasiAI Labs Backend Startup Script
"""

import uvicorn
import os
from pathlib import Path

# Set environment variables
os.environ.setdefault("ENV", "development")

if __name__ == "__main__":
    # Get the project root directory
    project_root = Path(__file__).parent
    
    # Configure uvicorn
    uvicorn.run(
        "app.main_simple:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
        reload_dirs=[str(project_root / "app")],
        access_log=True,
    )
