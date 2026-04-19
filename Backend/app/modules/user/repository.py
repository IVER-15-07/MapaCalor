from sqlalchemy.orm import Session

from app.modules.user.model import User
from app.modules.user.schema import UserCreate


class UserRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, payload: UserCreate) -> User:
        user = User(email=payload.email, full_name=payload.full_name)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_by_id(self, user_id: int) -> User | None:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email: str) -> User | None:
        return self.db.query(User).filter(User.email == email).first()

    def list(self, skip: int = 0, limit: int = 50) -> list[User]:
        return self.db.query(User).offset(skip).limit(limit).all()
