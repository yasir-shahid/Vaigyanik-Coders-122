from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    class Config:
        from_attributes = True  # updated for Pydantic v2

class PollCreate(BaseModel):
    question: str
    options: list[str]

class PollOut(BaseModel):
    id: int
    question: str
    options: list[str]
    class Config:
        from_attributes = True  # updated for Pydantic v2

class VoteCreate(BaseModel):
    poll_id: int
    choice: str 