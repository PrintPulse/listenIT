from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Radio


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
