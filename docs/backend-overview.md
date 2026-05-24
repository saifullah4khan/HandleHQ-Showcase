# Backend Overview

This showcase repo includes a sanitized backend slice in `backend-preview/` so readers can inspect how the product is structured behind the UI without exposing private production logic.

## What this preview shows

- Flask app factory setup in `backend-preview/preview_api/__init__.py`
- Route organization in `backend-preview/preview_api/routes.py`
- Shared JSON response helpers in `backend-preview/preview_api/responses.py`
- Pydantic request validation in `backend-preview/preview_api/schemas.py`
- Sample state management and pagination/filter logic in `backend-preview/preview_api/data_store.py`
- Basic write protection for mutable routes in `backend-preview/preview_api/auth.py`
- Pytest coverage for read/write paths in `backend-preview/tests/test_preview_api.py`

## What stays private

The production repository contains additional layers that are intentionally excluded here:

- AI conversation orchestration and extraction logic
- Channel integrations for email and WhatsApp
- Production authentication/session management
- Infrastructure, deployment, and environment wiring
- Internal operating notes and roadmap detail

## Design notes

The preview backend is intentionally in-memory and sample-data driven. That keeps the public repo runnable and useful while making it clear that the real operational code lives elsewhere.
