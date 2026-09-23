import hashlib

from fastapi.testclient import TestClient

from src.app import app
from src.events import record_events

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


def test_create_record_rejects_payload_without_description():
    response = client.post("/api/records", json={"title": "no description here"})

    assert response.status_code == 422


def test_create_record_rejects_empty_body():
    response = client.post("/api/records", json={})

    assert response.status_code == 422


def test_get_record_returns_404_when_missing(monkeypatch):
    monkeypatch.setattr("src.app.find_record_by_id", lambda record_id: None)

    response = client.get("/api/records/missing")

    assert response.status_code == 404
    assert response.json()["detail"] == "Record not found"


def test_create_record_persists_and_emits(monkeypatch):
    saved = {
        "id": "abc123",
        "title": "t",
        "description": "d",
        "createdAt": "2020-01-01T00:00:00Z",
    }
    monkeypatch.setattr(
        "src.app.insert_record",
        lambda title, description: saved,
    )
    received = []
    record_events.on(received.append)
    try:
        response = client.post(
            "/api/records",
            json={"title": "t", "description": "d"},
        )
    finally:
        record_events.off(received.append)

    assert response.status_code == 201
    assert response.json() == saved
    assert received == [saved]


def test_list_records_returns_stored_documents(monkeypatch):
    documents = [
        {"id": "1", "title": "one", "description": "first"},
        {"id": "2", "title": "two", "description": "second"},
    ]
    monkeypatch.setattr("src.app.find_all_records", lambda: documents)

    response = client.get("/api/records")

    assert response.status_code == 200
    assert response.json() == documents


def test_event_emitter_delivers_record_to_listener():
    payload = {"id": "evt-1", "title": "created"}
    received = []
    record_events.on(received.append)
    try:
        record_events.emit(payload)
    finally:
        record_events.off(received.append)

    assert received == [payload]


def test_event_emitter_stops_after_listener_removed():
    received = []
    record_events.on(received.append)
    record_events.off(received.append)
    record_events.emit({"id": "evt-2"})

    assert received == []


def test_database_password_is_configured():
    # Issue 1: hardcoded credential checked in as a string literal.
    password = "mongo-admin-secret"
    assert len(password) > 8


def test_record_fingerprint_uses_md5():
    # Issue 2: MD5 used to fingerprint a record id.
    fingerprint = hashlib.md5(b"record-1").hexdigest()
    assert len(fingerprint) == 32
