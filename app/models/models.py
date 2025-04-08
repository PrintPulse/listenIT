from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable
from sqlalchemy import Column, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship

from app.core.db import Base


class UserRadio(Base):
    __tablename__ = "user_radio"
    __table_args__ = (
        UniqueConstraint("user_id", "radio_id", name="unique_inter_model"),
    )

    user_id = Column(Integer, ForeignKey("user.id"))
    radio_id = Column(Integer, ForeignKey("radio.id"))


class User(SQLAlchemyBaseUserTable, Base):
    radios = relationship(
        "Radio", secondary="user_radio", back_populates="users"
    )


class Radio(Base):
    name = Column(String(100), unique=True, nullable=False)
    source = Column(String(250), unique=True, nullable=False)
    users = relationship(
        "User",
        secondary="user_radio",
        back_populates="radios",
        lazy="raise",
    )
