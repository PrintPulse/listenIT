from fastapi import HTTPException
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
            status_code=404, detail=f"Радио {radio_name} не существует!"
        )
    return obj


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
            status_code=400,
            detail=f"Радио {radio.name} уже добавлено в избранное!",
        )

    if key == "delete":
        if obj is None:
            raise HTTPException(
                status_code=400,
                detail=f"Радио {radio.name} не было добавлено в избранное!",
            )
        return obj
