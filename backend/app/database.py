from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# Database URL - using aiosqlite for async SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./producflow.db")

# The create_async_engine() function is used to create an asynchronous engine.
engine = create_async_engine(DATABASE_URL, echo=True)

# The async_sessionmaker() function is used to create an asynchronous session maker.
SessionLocal = async_sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False
)

# The declarative_base() is used to create the Base class for the models.
Base = declarative_base()