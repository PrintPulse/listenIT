from pydantic import BaseModel, ConfigDict, Field, field_validator


class RadioBase(BaseModel):
    name: str = Field(..., max_length=100)
    source: str = Field(..., max_length=250)


class RadioDB(RadioBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class RadioCreate(RadioBase):
    @field_validator("source")
    def check_format_aacp(value: str):
        if value.startswith("https://"):
            return value
        raise ValueError("Это должна быть ссылка звукового формата!")
