from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


TicketStatus = Literal["new", "reviewed", "actioned", "closed"]
SortField = Literal["created_at", "updated_at"]
SortOrder = Literal["asc", "desc"]
EventSource = Literal["admin", "email", "system", "whatsapp"]
EventStatus = Literal["info", "success", "warning", "error"]


class TicketListQuery(BaseModel):
    model_config = ConfigDict(extra="forbid")

    status: TicketStatus | None = None
    sort: SortField = "created_at"
    order: SortOrder = "desc"
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=20, ge=1, le=50)


class EventListQuery(BaseModel):
    model_config = ConfigDict(extra="forbid")

    source: EventSource | None = None
    status: EventStatus | None = None
    limit: int = Field(default=20, ge=1, le=50)
    offset: int = Field(default=0, ge=0)


class TicketPatchRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    status: TicketStatus | None = None
    notes: str | None = None

    @model_validator(mode="after")
    def require_at_least_one_field(self):
        if not self.model_fields_set:
            raise ValueError("At least one of status or notes must be provided.")
        if "status" in self.model_fields_set and self.status is None:
            raise ValueError("status cannot be null.")
        return self
