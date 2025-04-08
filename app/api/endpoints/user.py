from fastapi import APIRouter, Body, Depends, HTTPException, Request
from fastapi_users import exceptions
from pydantic import EmailStr

from app.api.schemas.user import UserCreate, UserRead, UserUpdate
from app.core.user import (
    UserManager,
    auth_backend,
    fastapi_users,
    get_user_manager,
)

router = APIRouter()


router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"],
)

router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)


reset_password_router = fastapi_users.get_reset_password_router()
reset_password_router.routes = [
    route
    for route in reset_password_router.routes
    if route.name != "reset:forgot_password"
]


@reset_password_router.post("/forgot-password")
async def forgot_password(
    request: Request,
    email: EmailStr = Body(..., embed=True),
    user_manager: UserManager = Depends(get_user_manager),
):
    try:
        user = await user_manager.get_by_email(email)
    except exceptions.UserNotExists:
        raise HTTPException(
            status_code=404, detail="Пользователя с таким email не существует!"
        )
    try:
        token = await user_manager.forgot_password(user, request)
    except exceptions.UserInactive:
        pass

    return {"token": token}


router.include_router(reset_password_router, prefix="/auth", tags=["auth"])

users_router = fastapi_users.get_users_router(UserRead, UserUpdate)
users_router.routes = [
    route for route in users_router.routes if route.name != "users:delete_user"
]

router.include_router(users_router, prefix="/users", tags=["users"])
