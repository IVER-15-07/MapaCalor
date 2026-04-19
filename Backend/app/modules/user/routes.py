from fastapi import APIRouter, Depends, Query, status

from app.modules.user.dependencies import get_user_service
from app.modules.user.schema import UserCreate, UserRead
from app.modules.user.service import UserService

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, service: UserService = Depends(get_user_service)):
    return service.create_user(payload)


@router.get("/", response_model=list[UserRead])
def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    service: UserService = Depends(get_user_service),
):
    return service.list_users(skip=skip, limit=limit)


@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: int, service: UserService = Depends(get_user_service)):
    return service.get_user(user_id)
