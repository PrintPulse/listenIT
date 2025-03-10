from fastapi import Depends, exceptions
from fastapi_users import (
    BaseUserManager,
    FastAPIUsers,
    IntegerIDMixin,
    InvalidPasswordException,
)
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
)
from fastapi_users.jwt import generate_jwt
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import config
from app.core.db import get_async_session
from app.models import User

bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")


async def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=config.secret, lifetime_seconds=7200)


auth_backend = AuthenticationBackend(
    "jwt_bearer", transport=bearer_transport, get_strategy=get_jwt_strategy
)


class UserManager(IntegerIDMixin, BaseUserManager):
    reset_password_token_secret = config.secret

    async def forgot_password(self, user, request=None) -> None:
        if not user.is_active:
            raise exceptions.UserInactive()

        token_data = {
            "sub": str(user.id),
            "password_fgpt": self.password_helper.hash(user.hashed_password),
            "aud": self.reset_password_token_audience,
        }
        token = generate_jwt(
            token_data,
            self.reset_password_token_secret,
            self.reset_password_token_lifetime_seconds,
        )
        return await self.on_after_forgot_password(user, token, request)

    async def validate_password(self, password, user):
        if len(password) < 8:
            raise InvalidPasswordException(
                reason="Пароль должен содержать 8 и более символов!"
            )
        if user.email in password:
            raise InvalidPasswordException(
                reason="Пароль не должен содержать почту!"
            )

    async def on_after_register(self, user, request=None):
        print(f"Пользователь {user.email} зарегистрирован")

    async def on_after_forgot_password(self, user, token, request=None):
        print(f"Пользователь {user.email} забыл пароль.")
        return token

    async def on_after_reset_password(self, user, request=None):
        print(f"Пользователь {user.email} сменил пароль.")


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session=session, user_table=User)


async def get_user_manager(
    user_db: SQLAlchemyUserDatabase = Depends(get_user_db),
):
    yield UserManager(user_db)


fastapi_users = FastAPIUsers(
    get_user_manager=get_user_manager, auth_backends=[auth_backend]
)


current_user = fastapi_users.current_user(active=True)
current_superuser = fastapi_users.current_user(active=True, superuser=True)
