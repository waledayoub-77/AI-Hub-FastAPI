from fastapi import APIRouter

from app.services.categories_service import get_all_categories

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("")
def list_categories():
    return get_all_categories()
