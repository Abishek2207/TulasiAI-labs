from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Supabase PostgreSQL configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/tulasi_ai")
# For async operations, use asyncpg driver
ASYNC_DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

# Create async engine for Supabase
async_engine = create_async_engine(
    ASYNC_DATABASE_URL,
    echo=False,  # Set to True for SQL logging
    pool_size=20,
    max_overflow=0,
    pool_pre_ping=True,
    pool_recycle=300,
)

# Create sync engine for migrations if needed
sync_engine = create_engine(DATABASE_URL, echo=False)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)

# Create sync session factory for migrations
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=sync_engine)

# Base class for models
class Base(DeclarativeBase):
    pass

# Dependency for async database sessions
async def get_async_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

# Dependency for sync database sessions (if needed)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Database initialization
async def create_tables():
    """Create all tables in the database"""
    async with async_engine.begin() as conn:
        # Import all models here to ensure they're registered
        from app.models import profile, skill, task, streak, notification, certification, career_prediction
        await conn.run_sync(Base.metadata.create_all)

# Test database connection
async def test_connection():
    """Test database connection"""
    try:
        async with async_engine.begin() as conn:
            await conn.execute("SELECT 1")
        print("Database connection successful!")
        return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False

# Close database connections
async def close_db():
    """Close database connections"""
    await async_engine.dispose()
