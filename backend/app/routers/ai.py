from fastapi import APIRouter, HTTPException

from app.schemas import UseModelBody
from app.services.ai_service import use_model

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/use-model")
def use_model_route(body: UseModelBody):
    try:
        return use_model(body.key, body.input)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
