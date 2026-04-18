from app.services.supabase_service import supabase_service


def get_models(category_id: str | None = None) -> list[dict]:
    query = supabase_service.client.table("models").select("*").order("id", desc=False)

    if category_id:
        query = query.eq("category_id", category_id)

    response = query.execute()
    return response.data or []


def get_model_by_id(model_id: str) -> dict:
    response = (
        supabase_service.client.table("models")
        .select("*")
        .eq("id", model_id)
        .single()
        .execute()
    )

    if not response.data:
        raise ValueError("Model not found")

    return response.data
