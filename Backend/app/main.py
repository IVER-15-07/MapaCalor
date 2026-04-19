from fastapi import FastAPI

from app.api.router import api_router
from app.db.base import Base
from app.db.session import engine



def create_app() -> FastAPI:
    app = FastAPI(title="COMTECO API")
    app.include_router(api_router, prefix="/api")

    @app.get("/health", tags=["health"])
    def health_check() -> dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)



