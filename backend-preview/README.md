# Backend Preview

This folder contains a sanitized Flask backend preview for the HandleHQ showcase.

What it demonstrates:
- Flask app factory structure
- JSON response helpers with request IDs
- Pydantic validation for query params and PATCH payloads
- Read and write routes over sample ticket/session/event data
- A minimal admin guard for mutation endpoints

What it intentionally does not include:
- Production AI orchestration
- Real auth/session implementation
- Webhook and channel integrations
- Secrets, environment wiring, or deployment config

## Run locally

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

The preview app will start at `http://127.0.0.1:8001`.

## Demo key

Read-only routes are open. Mutation routes use a simple preview-only header:

```text
X-Demo-Key: showcase-demo
```

That key exists only to show how protected write paths might be structured in a public-safe preview. The production auth flow remains private.
