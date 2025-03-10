from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import main_router
from app.core.config import config
from app.services import create_first_superuser

origins = config.allows_hosts.split(", ")


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_first_superuser()
    yield
    print("Приложение закончило работу")


app = FastAPI(
    title="listenIT",
    description="Стриминговый сервис прослушивания радио.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(main_router)
