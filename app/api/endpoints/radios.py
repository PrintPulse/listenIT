from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.schemas import RadioCreate, RadioDB
from app.api.validators import check_name_duplicate
from app.core.db import get_async_session
from app.core.user import current_superuser
from app.services import radio_manager

router = APIRouter()


@router.get("/", response_model=list[RadioDB])
async def get_all_radios(session: AsyncSession = Depends(get_async_session)):
    all_radios = await radio_manager.get(session=session)
    return all_radios


@router.post(
    "/", response_model=RadioDB, dependencies=[Depends(current_superuser)]
)
async def create_radio(
    radio: RadioCreate, session: AsyncSession = Depends(get_async_session)
):
    await check_name_duplicate(radio.name, session)
    new_radio = await radio_manager.create(radio, session)
    return new_radio
