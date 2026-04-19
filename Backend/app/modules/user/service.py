from fastapi import HTTPException, status

from app.modules.user.repository import UserRepository
from app.modules.user.schema import UserCreate


class UserService:
    def __init__(self, repository: UserRepository) -> None:
        self.repository = repository

    def create_user(self, payload: UserCreate):
        existing = self.repository.get_by_email(payload.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="El correo ya esta registrado.",
            )
        return self.repository.create(payload)

    def get_user(self, user_id: int):
        user = self.repository.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado.",
            )
        return user

    def list_users(self, skip: int = 0, limit: int = 50):
        return self.repository.list(skip=skip, limit=limit)
