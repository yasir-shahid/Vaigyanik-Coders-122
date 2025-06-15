from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.PollOut)
def create_poll(poll: schemas.PollCreate, db: Session = Depends(get_db)):
    new_poll = models.Poll(question=poll.question)
    db.add(new_poll)
    db.commit()
    db.refresh(new_poll)

    for opt in poll.options:
        option = models.Option(text=opt.text, poll_id=new_poll.id)
        db.add(option)

    db.commit()
    db.refresh(new_poll)
    return new_poll

@router.get("/{poll_id}", response_model=schemas.PollOut)
def get_poll(poll_id: int, db: Session = Depends(get_db)):
    poll = db.query(models.Poll).filter(models.Poll.id == poll_id).first()
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    return poll
