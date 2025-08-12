from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
import os
from dotenv import load_dotenv
from .settings import settings

load_dotenv()

# Database URL - using pydantic settings (env-file aware)
DATABASE_URL = settings.database_url

# The create_async_engine() function is used to create an asynchronous engine.
engine = create_async_engine(DATABASE_URL, echo=settings.debug)

# The async_sessionmaker() function is used to create an asynchronous session maker.
SessionLocal = async_sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False
)

# The declarative_base() is used to create the Base class for the models.
Base = declarative_base()