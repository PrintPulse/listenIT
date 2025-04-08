from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Radio


class ManagerRadio:
    model = Radio

    @classmethod
    async def get(cls, session: AsyncSession):
        radios = await session.execute(select(cls.model))
        return radios.scalars().all()


radio_manager = ManagerRadio()
