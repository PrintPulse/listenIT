from fastapi import APIRouter, Body

from app.api.integrations import match_fingerprint
from app.services import fragmented

router = APIRouter()


@router.post("/")
async def recognize(radio_url: str = Body(..., embed=True)):
    duration, fingerprint = fragmented(stream_url=radio_url)

    result = await match_fingerprint(duration, fingerprint)

    return result
