from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import Radio, User


class ManagerUserRadio:
    @staticmethod
    async def get_favorite(session: AsyncSession, user: User):
        stmt = (
            select(User)
            .options(selectinload(User.radios))
            .where(User.id == user.id)
        )
        user_load_radio = await session.execute(stmt)
        return user_load_radio.scalars().first().radios

    @staticmethod
    async def add_favorite(session: AsyncSession, user: User, radio: Radio):
        pass

    @staticmethod
    async def del_favorite(session: AsyncSession, user: User, radio: Radio):
        pass


user_radio_manager = ManagerUserRadio()
