from fastapi import HTTPException, status
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Radio, User, UserRadio


async def check_name_exists(radio_name: str, session: AsyncSession):
    obj = (
        (await session.execute(select(Radio).where(Radio.name == radio_name)))
        .scalars()
        .first()
    )
    if obj is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Радио {radio_name} не существует!",
        )
    return obj


async def check_name_duplicate(radio_name: str, session: AsyncSession):
    obj = (
        (await session.execute(select(Radio).where(Radio.name == radio_name)))
        .scalars()
        .first()
    )
    if obj:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Радио {radio_name} уже существует!",
        )


async def check_favorite_exists(
    user: User, radio: Radio, session: AsyncSession, key: str
):
    obj = (
        (
            await session.execute(
                select(UserRadio).where(
                    and_(
                        UserRadio.user_id == user.id,
                        UserRadio.radio_id == radio.id,
                    )
                )
            )
        )
        .scalars()
        .first()
    )
    if obj is not None and key == "add":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Радио {radio.name} уже добавлено в избранное!",
        )

    if key == "delete":
        if obj is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Радио {radio.name} не было добавлено в избранное!",
            )
        return obj


async def check_url_exists(radio_url: str, session: AsyncSession):
    obj = (
        (await session.execute(select(Radio).where(Radio.source == radio_url)))
        .scalars()
        .first()
    )
    if obj is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Адреса {radio_url} не существует!",
        )
    return obj
