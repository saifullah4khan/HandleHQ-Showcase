from __future__ import annotations

import os
from uuid import uuid4

from flask import Flask, g, request

from .data_store import PreviewStore
from .responses import error_response
from .routes import create_showcase_blueprint


def create_app(config: dict | None = None) -> Flask:
    app = Flask(__name__)
    app.config.update(
        JSON_SORT_KEYS=False,
        SHOWCASE_ADMIN_KEY=os.getenv("SHOWCASE_ADMIN_KEY", "showcase-demo"),
    )
    if config:
        app.config.update(config)

    app.extensions["preview_store"] = PreviewStore()

    @app.before_request
    def attach_request_id() -> None:
        g.request_id = request.headers.get("X-Request-Id") or uuid4().hex[:12]

    register_error_handlers(app)
    app.register_blueprint(create_showcase_blueprint())
    return app


def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(404)
    def not_found(_error):
        return error_response("Not found.", 404)

    @app.errorhandler(405)
    def method_not_allowed(_error):
        return error_response("Method not allowed.", 405)

    @app.errorhandler(500)
    def internal_error(_error):
        return error_response("Unexpected server error.", 500)
