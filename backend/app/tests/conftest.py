import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db import engine, async_session
# For brevity, we use TestClient with existing app — ensure init_db is called

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c
