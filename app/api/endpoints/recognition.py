from fastapi import APIRouter, Body, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.integrations import match_fingerprint
from app.api.validators import check_url_exists
from app.core.db import get_async_session
from app.core.user import current_user
from app.services import fragmented

router = APIRouter()


@router.post("/", dependencies=[Depends(current_user)])
async def recognize(
    radio_url: str = Body(..., embed=True),
    session: AsyncSession = Depends(get_async_session),
):
    await check_url_exists(radio_url=radio_url, session=session)

    duration, fingerprint = fragmented(stream_url=radio_url)

    result = await match_fingerprint(duration, fingerprint)

    return result
