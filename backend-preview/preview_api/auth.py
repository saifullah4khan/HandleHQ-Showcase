from __future__ import annotations

import hmac
from functools import wraps

from flask import current_app, request

from .responses import error_response


def require_demo_key(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        provided = request.headers.get("X-Demo-Key", "")
        expected = current_app.config.get("SHOWCASE_ADMIN_KEY", "")
        if not expected or not provided or not hmac.compare_digest(provided, expected):
            return error_response("Unauthorized.", 401)
        return view(*args, **kwargs)

    return wrapped
