from pydantic import BaseModel


class UseModelBody(BaseModel):
    key: str
    input: str
