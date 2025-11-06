import os
from fastapi import FastAPI
from .routes import auth_routes, claims_routes
from .db import init_db
from fastapi.middleware.cors import CORSMiddleware

from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.exporter.otlp.proto.grpc.exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

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


# Setup OpenTelemetry
trace_provider = TracerProvider()
otlp_exporter = OTLPSpanExporter(endpoint="http://otel-collector:4317", insecure=True)
trace_provider.add_span_processor(BatchSpanProcessor(otlp_exporter))
FastAPIInstrumentor.instrument_app(app, tracer_provider=trace_provider)

