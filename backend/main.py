from fastapi import FastAPI
from app.database import Base, engine
from app.routes import auth, poll, vote
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()
@app.get("/")
def read_root():
    return {"message": "Welcome to DVote API"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(poll.router, prefix="/api/v1/poll", tags=["Poll"])
app.include_router(vote.router, prefix="/api/v1/vote", tags=["Vote"])