from fastapi import APIRouter, Body, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.schemas import RadioDB
from app.api.validators import check_name_exists
from app.core.db import get_async_session
from app.core.user import current_user
from app.models import User
from app.services import user_radio_manager

router = APIRouter()


@router.get("/", response_model=list[RadioDB])
async def get_favorite_radio(
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),
):
    favorites = await user_radio_manager.get_favorite(
        session=session, user=user
    )
    return favorites


@router.post("/", response_model=RadioDB)
async def add_favorite_radio(
    name: str = Body(..., embed=True),
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),
):
    radio_obj = await check_name_exists(radio_name=name, session=session)

    favorite_radio = await user_radio_manager.add_favorite(
        session=session, user=user, radio=radio_obj
    )
    return favorite_radio


@router.delete("/", response_model=RadioDB)
async def delete_favorite_radio(
    name: str = Body(..., embed=True),
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),
):
    pass
