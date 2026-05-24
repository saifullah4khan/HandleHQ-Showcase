# API Examples

These examples target the sanitized backend preview in `backend-preview/`.

## Start the app

```bash
cd backend-preview
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

## Read-only routes

```bash
curl http://127.0.0.1:8001/health
curl http://127.0.0.1:8001/api/v1/showcase/summary
curl "http://127.0.0.1:8001/api/v1/showcase/tickets?status=new&per_page=2"
curl http://127.0.0.1:8001/api/v1/showcase/tickets/1048
curl http://127.0.0.1:8001/api/v1/showcase/events
curl http://127.0.0.1:8001/api/v1/showcase/sessions/sara@lunaatelier.pk/history
```

## Mutation routes

```bash
curl -X PATCH http://127.0.0.1:8001/api/v1/showcase/tickets/1047 ^
  -H "Content-Type: application/json" ^
  -H "X-Demo-Key: showcase-demo" ^
  -d "{\"status\":\"reviewed\",\"notes\":\"Qualified lead. Prep shortlist.\"}"
```

```bash
curl -X POST http://127.0.0.1:8001/api/v1/showcase/reset ^
  -H "X-Demo-Key: showcase-demo"
```

## Note

`X-Demo-Key` is only a public preview guard for writable routes. It is not the production auth flow.
