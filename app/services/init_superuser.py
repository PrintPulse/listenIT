from contextlib import asynccontextmanager

from fastapi_users.exceptions import UserAlreadyExists
from pydantic import EmailStr

from app.api.schemas.user import UserCreate
from app.core.config import config
from app.core.db import get_async_session
from app.core.user import get_user_db, get_user_manager

get_async_session_context = asynccontextmanager(get_async_session)
get_user_db_context = asynccontextmanager(get_user_db)
get_user_manager_context = asynccontextmanager(get_user_manager)


async def create_superuser(
    email: EmailStr, password: str, is_superuser: bool = False
):
    try:
        async with get_async_session_context() as session:
            async with get_user_db_context(session) as user_db:
                async with get_user_manager_context(user_db) as user_manager:
                    await user_manager.create(
                        user_create=UserCreate(
                            email=email,
                            password=password,
                            is_superuser=is_superuser,
                        )
                    )
    except UserAlreadyExists:
        pass


async def create_first_superuser():
    if (
        config.email_first_admin is not None
        and config.password_first_admin is not None
    ):
        await create_superuser(
            email=config.email_first_admin,
            password=config.password_first_admin,
            is_superuser=True,
        )
