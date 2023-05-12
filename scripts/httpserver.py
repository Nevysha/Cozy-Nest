from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
import asyncio
import os
from modules import script_callbacks
from typing import Any


def cozy_nest_http(_: Any, app: FastAPI, **kwargs):
    pre = "/cozy-nest-image-browser"
    base_dir = os.path.normpath(os.path.join(__file__, "../../"))
    app.mount(
        f"{pre}/static",
        StaticFiles(directory=f"{base_dir}/cozy-nest-image-browser"),
        name="cozy-nest-image-browser-static",
    )

    @app.get(f"{pre}/ping")
    async def greeting():
        return "pong"

script_callbacks.on_app_started(cozy_nest_http)


