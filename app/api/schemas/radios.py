from pydantic import BaseModel, ConfigDict, Field


class Radio(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str = Field(..., max_length=100)
    source: str = Field(..., max_length=250)
