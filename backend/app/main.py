from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.ai import router as ai_router
from app.routers.categories import router as categories_router
from app.routers.models import router as models_router

app = FastAPI(title="AI Hub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Hello World!"}


app.include_router(categories_router)
app.include_router(models_router)
app.include_router(ai_router)
