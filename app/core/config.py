from pydantic import EmailStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Config(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    database_url: str = "sqlite+aiosqlite:///./data_base.db"
    secret: str
    allows_hosts: str
    email_first_admin: EmailStr
    password_first_admin: str


config = Config()
