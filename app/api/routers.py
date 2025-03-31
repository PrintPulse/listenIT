from fastapi import APIRouter

from .endpoints import (
    radio_router,
    recognition_router,
    user_radio_router,
    user_router,
)

main_router = APIRouter()


main_router.include_router(user_router)

main_router.include_router(radio_router, prefix="/radio", tags=["radio"])

main_router.include_router(
    user_radio_router, prefix="/favorite", tags=["favorite"]
)

main_router.include_router(
    recognition_router, prefix="/recognize", tags=["recognition"]
)
