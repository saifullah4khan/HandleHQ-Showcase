from __future__ import annotations

import pytest

from preview_api import create_app


@pytest.fixture()
def client():
    app = create_app({"TESTING": True, "SHOWCASE_ADMIN_KEY": "showcase-demo"})
    return app.test_client()


def test_health_route_returns_request_id(client):
    response = client.get("/health")
    body = response.get_json()

    assert response.status_code == 200
    assert body["status"] == "ok"
    assert body["sample_data"] is True
    assert "request_id" in body


def test_ticket_list_supports_filter_and_pagination(client):
    response = client.get("/api/v1/showcase/tickets?status=new&per_page=1&page=1")
    body = response.get_json()

    assert response.status_code == 200
    assert body["status"] == "ok"
    assert body["total"] == 2
    assert body["per_page"] == 1
    assert len(body["tickets"]) == 1
    assert body["tickets"][0]["status"] == "new"


def test_ticket_update_requires_demo_key(client):
    response = client.patch("/api/v1/showcase/tickets/1047", json={"status": "reviewed"})
    body = response.get_json()

    assert response.status_code == 401
    assert body["error"] == "Unauthorized."


def test_ticket_update_changes_ticket_and_logs_event(client):
    response = client.patch(
        "/api/v1/showcase/tickets/1047",
        headers={"X-Demo-Key": "showcase-demo"},
        json={"status": "reviewed", "notes": "Qualified lead. Prep shortlist."},
    )
    body = response.get_json()

    assert response.status_code == 200
    assert body["ticket"]["status"] == "reviewed"
    assert body["ticket"]["notes"] == "Qualified lead. Prep shortlist."

    events_response = client.get("/api/v1/showcase/events?limit=20")
    events_body = events_response.get_json()

    matching_events = [
        event
        for event in events_body["events"]
        if event["event_type"] == "ticket_updated" and event["ticket_id"] == 1047
    ]
    assert matching_events


def test_session_history_returns_conversation(client):
    response = client.get("/api/v1/showcase/sessions/sara@lunaatelier.pk/history")
    body = response.get_json()

    assert response.status_code == 200
    assert body["user_id"] == "sara@lunaatelier.pk"
    assert body["turn_count"] == 6
    assert len(body["messages"]) == 6
