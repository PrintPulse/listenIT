from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.schemas import Radio
from app.core.db import get_async_session
from app.services import radio_manager

router = APIRouter()


@router.get("/", response_model=list[Radio])
async def get_all_radios(session: AsyncSession = Depends(get_async_session)):
    all_radios = await radio_manager.get(session=session)
    return all_radios
