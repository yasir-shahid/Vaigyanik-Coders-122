from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.VoteOut)
def vote(vote: schemas.VoteCreate, db: Session = Depends(get_db)):
    poll = db.query(models.Poll).filter(models.Poll.id == vote.poll_id).first()
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")

    option = db.query(models.Option).filter(models.Option.id == vote.option_id, models.Option.poll_id == vote.poll_id).first()
    if not option:
        raise HTTPException(status_code=404, detail="Option not found for this poll")

    option.votes += 1
    db.commit()
    db.refresh(option)
    return {"poll_id": vote.poll_id, "option_id": vote.option_id, "votes": option.votes}
