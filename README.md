# HandleHQ Public Showcase

This folder is a public-safe showcase cut from the private HandleHQ repo.

What is included:
- The marketing site in `marketing/`
- A working React dashboard demo in `frontend/`
- A sanitized Flask backend preview in `backend-preview/`
- Local mock data for tickets, conversations, and activity so the UI stays interactive

What is intentionally excluded:
- Production backend code
- AI prompt and extraction logic
- Auth implementation details
- Real integrations, secrets, deployment config, and internal notes

## Run the dashboard demo

```bash
cd frontend
npm install
npm run dev
```

Use the demo key `showcase-demo` on the login screen.

## Preview the marketing site

You can open the files in `marketing/` directly, or serve them with any simple static server.

## Explore the backend preview

The backend preview lives in `backend-preview/` and shows a public-safe slice of the architecture:

- Flask app factory and route structure
- Pydantic validation
- Shared JSON response helpers
- In-memory sample data for tickets, events, and session history
- Basic tests covering pagination, mutation, and protected write routes

See:
- `backend-preview/README.md`
- `docs/backend-overview.md`
- `docs/api-examples.md`

## Notes

- The dashboard stores demo edits in browser `localStorage`.
- Use the `Reset Demo` button to restore the original sample dataset.
- No license file is included here, so default copyright rules apply unless you add one before publishing.
