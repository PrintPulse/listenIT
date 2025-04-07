from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.schemas import RadioCreate
from app.models import Radio


class ManagerRadio:
    model = Radio

    @classmethod
    async def get(cls, session: AsyncSession):
        radios = await session.execute(select(cls.model))
        return radios.scalars().all()

    @classmethod
    async def create(cls, radio: RadioCreate, session: AsyncSession):
        radio_db = cls.model(**radio.model_dump())
        session.add(radio_db)
        await session.commit()
        await session.refresh(radio_db)
        return radio_db


radio_manager = ManagerRadio()
