import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.core.db import get_async_session
from app.core.user import current_user
from app.main import app
from app.models import User
from tests.conftest import override_db

user = User(
    id=1,
    is_active=True,
    is_verified=True,
    is_superuser=False,
)

anonym_user = User(
    id=2, is_active=False, is_verified=False, is_superuser=False
)


@pytest.fixture
def user_client():
    app.dependency_overrides = {}
    app.dependency_overrides[get_async_session] = override_db
    app.dependency_overrides[current_user] = lambda: user

    with TestClient(app) as client:
        yield client


@pytest.fixture
def anonym_client():
    def raise_forbidden():
        raise HTTPException(
            status_code=401, detail="Пользователь не авторизован!"
        )

    app.dependency_overrides = {}
    app.dependency_overrides[get_async_session] = override_db
    app.dependency_overrides[current_user] = lambda: raise_forbidden()

    with TestClient(app) as client:
        yield client
