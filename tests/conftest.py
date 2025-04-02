from pathlib import Path

import pytest
from mixer.backend.sqlalchemy import Mixer as _mixer
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import sessionmaker

from app.core.base import Base

pytest_plugins = ["tests.fixtures.user", "tests.fixtures.data"]


BASE_DIR = Path(__file__).resolve(strict=True).parent.parent


TEST_DB = BASE_DIR / "test.db"
AIO_SQLALCHEMY_URL_DB = f"sqlite+aiosqlite:///{str(TEST_DB)}"
SQLALCHEMY_URL_DB = f"sqlite:///{str(TEST_DB)}"
engine = create_async_engine(AIO_SQLALCHEMY_URL_DB)
TestSessionLocal = async_sessionmaker(class_=AsyncSession, bind=engine)


async def override_db():
    async with TestSessionLocal() as session:
        yield session


@pytest.fixture(autouse=True)
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
def mixer():
    mixer_engine = create_async_engine(SQLALCHEMY_URL_DB)
    get_sync_session = sessionmaker(mixer_engine)
    return _mixer(session=get_sync_session(), commit=True)
