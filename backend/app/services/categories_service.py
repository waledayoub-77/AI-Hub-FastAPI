from app.services.supabase_service import supabase_service


def get_all_categories() -> list[dict]:
    response = (
        supabase_service.client.table("categories")
        .select("*")
        .order("id", desc=False)
        .execute()
    )

    return response.data or []
