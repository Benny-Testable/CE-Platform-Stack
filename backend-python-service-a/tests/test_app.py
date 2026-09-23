from fastapi.testclient import TestClient

from src.app import app

client = TestClient(app)


def test_health_reports_service_identity():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "backend-python-service-a",
    }


def test_create_record_rejects_payload_without_title():
    response = client.post("/api/records", json={"description": "no title here"})

    assert response.status_code == 422
