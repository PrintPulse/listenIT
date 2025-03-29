from fastapi import APIRouter, Body, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.schemas import RadioDB
from app.api.validators import check_favorite_exists, check_name_exists
from app.core.constans import ERRORS_ADD, ERRORS_DELETE
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


@router.post("/", response_model=RadioDB, responses=ERRORS_ADD)
async def add_favorite_radio(
    name: str = Body(..., embed=True),
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),
):
    radio_obj = await check_name_exists(radio_name=name, session=session)

    await check_favorite_exists(
        user=user, radio=radio_obj, session=session, key="add"
    )

    add_obj = await user_radio_manager.add_favorite(
        session=session, user=user, radio=radio_obj
    )
    return add_obj


@router.delete("/", response_model=RadioDB, responses=ERRORS_DELETE)
async def delete_favorite_radio(
    name: str = Body(..., embed=True),
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),
):
    radio_obj = await check_name_exists(radio_name=name, session=session)

    favorite_obj = await check_favorite_exists(
        user=user, radio=radio_obj, session=session, key="delete"
    )

    del_radio = await user_radio_manager.del_favorite(
        del_obj=favorite_obj, radio=radio_obj, session=session
    )
    return del_radio
