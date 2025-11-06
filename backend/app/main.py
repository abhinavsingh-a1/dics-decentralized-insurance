import os
from fastapi import FastAPI
from .routes import auth_routes, claims_routes
from .db import init_db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="DICS Backend - Aurelia Labs", version="0.1.0")

app.include_router(auth_routes.router)
app.include_router(claims_routes.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    # init DB
    await init_db()

@app.get("/")
def root():
    return {"message": "DICS Backend (Aurelia Labs)"}
