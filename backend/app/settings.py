from pydantic import BaseSettings, validator
from typing import List

class Settings(BaseSettings):
    # Database
    database_url: str = "sqlite+aiosqlite:///./producflow.db"

    # Security
    secret_key: str = "change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # CORS
    cors_origins: List[str] = ["http://localhost:3000"]

    # Environment
    environment: str = "development"
    debug: bool = True

    # API server
    api_host: str = "0.0.0.0"
    api_port: int = 8000

    @validator("cors_origins", pre=True)
    def assemble_cors_origins(cls, v):
        if isinstance(v, str):
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()