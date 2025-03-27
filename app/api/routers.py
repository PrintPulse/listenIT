from fastapi import APIRouter

from .endpoints import radio_router, user_router

main_router = APIRouter()


main_router.include_router(user_router)

main_router.include_router(radio_router, prefix="/radios", tags=["radio"])
