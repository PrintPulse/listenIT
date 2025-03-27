from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.schemas import Radio
from app.core.db import get_async_session
from app.core.user import current_user
from app.models import User
from app.services import user_radio_manager

router = APIRouter()


@router.get("/", response_model=list[Radio])
async def get_favorite_radio(
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),
):
    favorites = await user_radio_manager.get_favorite(
        session=session, user=user
    )
    return favorites


@router.post("/", response_model=Radio)
async def add_favorite_radio(
    radio: Radio,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),
):
    pass


@router.delete("/")
async def delete_favorite_radio(
    radio: Radio,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),
):
    pass
