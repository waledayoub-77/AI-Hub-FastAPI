from fastapi import APIRouter, HTTPException, Query

from app.services.models_service import get_model_by_id, get_models

router = APIRouter(prefix="/models", tags=["models"])


@router.get("")
def list_models(categoryId: str | None = Query(default=None)):
    return get_models(categoryId)


@router.get("/{model_id}")
def read_model(model_id: str):
    try:
        return get_model_by_id(model_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
