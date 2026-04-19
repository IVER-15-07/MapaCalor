from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.modules.user.repository import UserRepository
from app.modules.user.service import UserService


def get_user_repository(db: Session = Depends(get_db)) -> UserRepository:
    return UserRepository(db=db)


def get_user_service(repository: UserRepository = Depends(get_user_repository)) -> UserService:
    return UserService(repository=repository)
