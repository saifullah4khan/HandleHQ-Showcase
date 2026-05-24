from __future__ import annotations

from typing import Any

from flask import g, jsonify


def error_response(message: str, status_code: int = 400, *, details: Any | None = None):
    payload: dict[str, Any] = {"status": "error", "error": message}
    request_id = getattr(g, "request_id", None)
    if request_id:
        payload["request_id"] = request_id
    if details is not None:
        payload["details"] = details
    response = jsonify(payload)
    response.status_code = status_code
    return response


def success_response(payload: dict[str, Any], status_code: int = 200):
    body = dict(payload)
    request_id = getattr(g, "request_id", None)
    if request_id and "request_id" not in body:
        body["request_id"] = request_id
    response = jsonify(body)
    response.status_code = status_code
    return response
