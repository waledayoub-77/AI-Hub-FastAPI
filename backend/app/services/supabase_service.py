from supabase import Client, create_client

from app.core.config import settings


class SupabaseService:
    def __init__(self) -> None:
        self._client: Client | None = None

    @property
    def client(self) -> Client:
        if self._client is not None:
            return self._client

        if not settings.supabase_url or not settings.supabase_key:
            raise RuntimeError(
                "SUPABASE_URL and SUPABASE_KEY are required. Add them to backend/.env."
            )

        self._client = create_client(settings.supabase_url, settings.supabase_key)
        return self._client


supabase_service = SupabaseService()
