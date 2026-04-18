# AI Hub FastAPI Backend

This backend was migrated from NestJS to FastAPI.

## Endpoints

- `GET /` - health message
- `GET /categories`
- `GET /models?categoryId=<id>`
- `GET /models/{id}`
- `POST /ai/use-model`

## Setup

1. Create and activate a virtual environment.
2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Copy `.env.example` to `.env` and set values.
4. Run server:

   ```bash
   python main.py
   ```

The server uses `PORT` from `.env` and defaults to `3000`.
