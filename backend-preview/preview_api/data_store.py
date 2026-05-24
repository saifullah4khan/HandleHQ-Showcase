from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timezone
from math import ceil

from .sample_data import clone_initial_state


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


class PreviewStore:
    def __init__(self) -> None:
        self.reset()

    def reset(self) -> dict:
        state = clone_initial_state()
        self._tickets = state["tickets"]
        self._events = state["events"]
        self._sessions = state["sessions_by_user_id"]
        return self.summary()

    def summary(self) -> dict:
        by_status = {"new": 0, "reviewed": 0, "actioned": 0, "closed": 0}
        for ticket in self._tickets:
            by_status[ticket["status"]] += 1

        return {
            "open_tickets": by_status["new"],
            "in_progress": by_status["reviewed"] + by_status["actioned"],
            "closed": by_status["closed"],
            "total_tickets": len(self._tickets),
            "by_status": by_status,
        }

    def list_tickets(
        self,
        *,
        status_filter: str | None,
        sort_field: str,
        order_dir: str,
        page: int,
        per_page: int,
    ) -> dict:
        tickets = [ticket for ticket in self._tickets if not status_filter or ticket["status"] == status_filter]
        reverse = order_dir == "desc"
        tickets = sorted(tickets, key=lambda ticket: (ticket[sort_field], ticket["id"]), reverse=reverse)

        total = len(tickets)
        total_pages = max(1, ceil(total / per_page))
        page = min(page, total_pages)
        start = (page - 1) * per_page
        records = tickets[start : start + per_page]

        return {
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": total_pages,
            "tickets": deepcopy(records),
        }

    def get_ticket(self, ticket_id: int) -> dict | None:
        for ticket in self._tickets:
            if ticket["id"] == ticket_id:
                return deepcopy(ticket)
        return None

    def update_ticket(self, ticket_id: int, *, fields: set[str], status: str | None, notes: str | None) -> dict:
        ticket = next((record for record in self._tickets if record["id"] == ticket_id), None)
        if ticket is None:
            raise KeyError(ticket_id)

        previous = deepcopy(ticket)
        changed = False

        if "status" in fields and status != ticket["status"]:
            ticket["status"] = status
            changed = True
        if "notes" in fields and notes != ticket["notes"]:
            ticket["notes"] = notes
            changed = True

        if not changed:
            raise ValueError("No changes detected.")

        ticket["updated_at"] = utc_now_iso()
        self._record_admin_update(ticket, previous)
        return deepcopy(ticket)

    def get_session_history(self, user_id: str) -> dict | None:
        session = self._sessions.get(user_id)
        return deepcopy(session) if session else None

    def list_events(
        self,
        *,
        source_filter: str | None,
        status_filter: str | None,
        limit: int,
        offset: int,
    ) -> dict:
        events = [
            event
            for event in self._events
            if (not source_filter or event["source"] == source_filter)
            and (not status_filter or event["status"] == status_filter)
        ]
        events = sorted(events, key=lambda event: (event["created_at"], event["id"]), reverse=True)
        return {
            "total": len(events),
            "limit": limit,
            "offset": offset,
            "events": deepcopy(events[offset : offset + limit]),
        }

    def _record_admin_update(self, ticket: dict, previous: dict) -> None:
        status_changed = previous["status"] != ticket["status"]
        notes_updated = previous["notes"] != ticket["notes"]

        if status_changed and notes_updated:
            summary = f"Ticket #{ticket['id']} status and notes updated by admin."
        elif status_changed:
            summary = (
                f"Ticket #{ticket['id']} status changed from {previous['status']} "
                f"to {ticket['status']}."
            )
        else:
            summary = f"Admin notes updated for ticket #{ticket['id']}."

        next_id = max(event["id"] for event in self._events) + 1 if self._events else 1
        self._events.insert(
            0,
            {
                "id": next_id,
                "source": "admin",
                "event_type": "ticket_updated",
                "status": "info",
                "summary": summary,
                "user_id": ticket["user_id"],
                "ticket_id": ticket["id"],
                "request_id": None,
                "payload": {
                    "status_changed": status_changed,
                    "previous_status": previous["status"],
                    "current_status": ticket["status"],
                    "notes_updated": notes_updated,
                },
                "created_at": ticket["updated_at"],
            },
        )
