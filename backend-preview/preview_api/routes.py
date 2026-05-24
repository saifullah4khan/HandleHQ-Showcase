from __future__ import annotations

from flask import Blueprint, current_app, request
from pydantic import ValidationError

from .auth import require_demo_key
from .responses import error_response, success_response
from .schemas import EventListQuery, TicketListQuery, TicketPatchRequest


def create_showcase_blueprint() -> Blueprint:
    bp = Blueprint("showcase_preview", __name__)

    @bp.get("/")
    def home():
        return success_response(
            {
                "status": "ok",
                "service": "handlehq-showcase-backend-preview",
                "sample_data": True,
                "docs": [
                    "/api/v1/showcase/summary",
                    "/api/v1/showcase/tickets",
                    "/api/v1/showcase/events",
                    "/api/v1/showcase/sessions/<user_id>/history",
                ],
            }
        )

    @bp.get("/health")
    def health():
        return success_response({"status": "ok", "mode": "showcase", "sample_data": True})

    @bp.get("/api/v1/showcase/summary")
    def summary():
        store = current_app.extensions["preview_store"]
        return success_response({"status": "ok", **store.summary()})

    @bp.get("/api/v1/showcase/tickets")
    def list_tickets():
        query, error = validate_model(TicketListQuery, request.args.to_dict())
        if error:
            return error

        store = current_app.extensions["preview_store"]
        payload = store.list_tickets(
            status_filter=query.status,
            sort_field=query.sort,
            order_dir=query.order,
            page=query.page,
            per_page=query.per_page,
        )
        return success_response({"status": "ok", **payload})

    @bp.get("/api/v1/showcase/tickets/<int:ticket_id>")
    def get_ticket(ticket_id: int):
        store = current_app.extensions["preview_store"]
        ticket = store.get_ticket(ticket_id)
        if ticket is None:
            return error_response("Ticket not found.", 404)
        return success_response({"status": "ok", "ticket": ticket})

    @bp.patch("/api/v1/showcase/tickets/<int:ticket_id>")
    @require_demo_key
    def patch_ticket(ticket_id: int):
        payload = request.get_json(silent=True)
        if not isinstance(payload, dict):
            return error_response("Invalid request body. Expected a JSON object.", 400)

        patch, error = validate_model(TicketPatchRequest, payload)
        if error:
            return error

        store = current_app.extensions["preview_store"]
        try:
            ticket = store.update_ticket(
                ticket_id,
                fields=patch.model_fields_set,
                status=patch.status,
                notes=patch.notes,
            )
        except KeyError:
            return error_response("Ticket not found.", 404)
        except ValueError as exc:
            return error_response(str(exc), 400)

        return success_response({"status": "ok", "ticket": ticket})

    @bp.get("/api/v1/showcase/sessions/<path:user_id>/history")
    def session_history(user_id: str):
        store = current_app.extensions["preview_store"]
        session = store.get_session_history(user_id)
        if session is None:
            return error_response("Session not found.", 404)
        return success_response(session)

    @bp.get("/api/v1/showcase/events")
    def list_events():
        query, error = validate_model(EventListQuery, request.args.to_dict())
        if error:
            return error

        store = current_app.extensions["preview_store"]
        payload = store.list_events(
            source_filter=query.source,
            status_filter=query.status,
            limit=query.limit,
            offset=query.offset,
        )
        return success_response({"status": "ok", **payload})

    @bp.post("/api/v1/showcase/reset")
    @require_demo_key
    def reset_showcase():
        store = current_app.extensions["preview_store"]
        summary = store.reset()
        return success_response({"status": "ok", "message": "Showcase data reset.", **summary})

    return bp


def validate_model(model_cls, payload: dict):
    try:
        return model_cls.model_validate(payload), None
    except ValidationError as exc:
        return None, error_response(
            "Validation failed.",
            400,
            details=exc.errors(include_url=False),
        )
