from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import Radio, User, UserRadio


class ManagerUserRadio:
    user = User
    radio = Radio

    @classmethod
    async def get_favorite(cls, session: AsyncSession, user: User):
        stmt = (
            select(cls.user)
            .options(selectinload(cls.user.radios))
            .where(cls.user.id == user.id)
        )
        user_load_radio = await session.execute(stmt)
        return user_load_radio.scalars().first().radios

    @classmethod
    async def add_favorite(
        cls, session: AsyncSession, user: User, radio: Radio
    ):
        add_obj = UserRadio(user_id=user.id, radio_id=radio.id)
        session.add(add_obj)
        await session.commit()
        await session.refresh(radio)
        return radio

    @classmethod
    async def del_favorite(
        cls, del_obj: UserRadio, radio: Radio, session: AsyncSession
    ):
        await session.delete(del_obj)
        await session.commit()
        await session.refresh(radio)
        return radio


user_radio_manager = ManagerUserRadio()
