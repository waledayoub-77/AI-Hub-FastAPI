from datetime import datetime, timezone

from openai import OpenAI

from app.core.config import settings
from app.services.supabase_service import supabase_service


def use_model(key: str, user_input: str) -> dict:
    if not key or not user_input:
        raise ValueError("Both key and input are required.")

    if key == "summarizer":
        output = generate_text(
            "Summarize the user text into concise bullet points.",
            user_input,
        )
    elif key == "translator":
        output = generate_text(
            "Translate the user text. Keep the meaning and tone intact.",
            user_input,
        )
    elif key == "chat":
        output = generate_text("Reply as a helpful AI assistant.", user_input)
    elif key == "image-generator":
        output = generate_image(user_input)
    else:
        raise ValueError("Unsupported model key.")

    save_history(key, user_input, output)

    return {"key": key, "output": output}


def generate_text(instruction: str, user_input: str) -> str:
    client = get_openai_client()

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": instruction},
            {"role": "user", "content": user_input},
        ],
    )

    message = response.choices[0].message.content if response.choices else ""
    return message or ""


def generate_image(user_input: str) -> str:
    client = get_openai_client()

    response = client.images.generate(
        model="gpt-image-1",
        prompt=user_input,
        size="1024x1024",
    )

    image = response.data[0] if response.data else None
    if not image:
        return "No image generated."

    if image.url:
        return image.url

    if image.b64_json:
        return f"data:image/png;base64,{image.b64_json}"

    return "Image generated but no display payload returned."


def save_history(key: str, user_input: str, output: str) -> None:
    # Keep history logging best-effort so AI responses are not blocked.
    supabase_service.client.table("history").insert(
        {
            "key": key,
            "input": user_input,
            "output": output,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
    ).execute()


def get_openai_client() -> OpenAI:
    if not settings.openai_api_key:
        raise ValueError("OPENAI_API_KEY is required to use AI models.")

    return OpenAI(api_key=settings.openai_api_key)
