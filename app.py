import os
import sys
import time
import traceback
from contextlib import asynccontextmanager
from typing import Optional

import requests
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEB_DIR = os.path.join(BASE_DIR, "web")

DOMINO_API_HOST = os.environ.get("DOMINO_API_HOST", "").rstrip("/")
DOMINO_PROJECT_ID = os.environ.get("DOMINO_PROJECT_ID", "")
DOMINO_PROJECT_NAME = os.environ.get("DOMINO_PROJECT_NAME", "")
DOMINO_PROJECT_OWNER = os.environ.get("DOMINO_PROJECT_OWNER", "")

_decisions: list = []
_weights: dict = {}


def get_auth_headers():
    api_key = os.environ.get("API_KEY_OVERRIDE")
    if api_key:
        return {"X-Domino-Api-Key": api_key}
    try:
        r = requests.get("http://localhost:8899/access-token", timeout=3)
        r.raise_for_status()
        token = r.text.strip()
        if token.startswith("Bearer "):
            return {"Authorization": token}
        return {"Authorization": f"Bearer {token}"}
    except Exception as e:
        print(f"[auth] access-token unavailable: {e}", file=sys.stdout, flush=True)
        return None


def domino_ready() -> bool:
    return bool(DOMINO_API_HOST) and get_auth_headers() is not None


@asynccontextmanager
async def lifespan(app):
    print(
        f"[startup] DOMINO_API_HOST={DOMINO_API_HOST or '<unset>'} "
        f"project={DOMINO_PROJECT_NAME or '<unset>'}",
        flush=True,
    )
    yield


app = FastAPI(title="Cross-Disease Repurposing Scanner", lifespan=lifespan)


@app.get("/api/health")
async def health():
    connected = domino_ready()
    return {
        "status": "ok",
        "connected": connected,
        "dominoApiHost": DOMINO_API_HOST,
        "projectId": DOMINO_PROJECT_ID,
        "projectName": DOMINO_PROJECT_NAME,
    }


@app.get("/api/portfolio")
async def portfolio():
    if not domino_ready():
        raise HTTPException(status_code=503, detail="Domino backend not configured")
    return {"compounds": [], "pending": "compound portfolio API not yet implemented"}


@app.get("/api/scan/{compound_id}")
async def scan(compound_id: str):
    if not domino_ready():
        raise HTTPException(status_code=503, detail="Domino backend not configured")
    return {
        "compound_id": compound_id,
        "indications": [],
        "pending": "cross-disease indication scan pipeline not yet wired",
    }


@app.get("/api/dossier/{compound_id}/{indication_id}")
async def dossier(compound_id: str, indication_id: str):
    if not domino_ready():
        raise HTTPException(status_code=503, detail="Domino backend not configured")
    return {
        "compound_id": compound_id,
        "indication_id": indication_id,
        "dossier": None,
        "pending": "LLM-assisted dossier generation not yet implemented (Claude tenant-private)",
    }


@app.get("/api/committee")
async def committee():
    if not domino_ready():
        raise HTTPException(status_code=503, detail="Domino backend not configured")
    return {"candidates": [], "pending": "committee ranking API not yet implemented"}


@app.get("/api/dusty-shelf")
async def dusty_shelf():
    if not domino_ready():
        raise HTTPException(status_code=503, detail="Domino backend not configured")
    return {"compounds": [], "pending": "dusty shelf signal pipeline not yet implemented"}


@app.get("/api/decisions")
async def get_decisions():
    return {"decisions": _decisions}


class DecisionBody(BaseModel):
    compoundId: str
    indicationId: str
    decision: str
    rationale: str
    decidedBy: str
    evidenceSnapshot: Optional[dict] = None


@app.post("/api/decisions")
async def record_decision(body: DecisionBody):
    decision = {
        "id": f"dec-{int(time.time() * 1000)}",
        "compoundId": body.compoundId,
        "indicationId": body.indicationId,
        "decision": body.decision,
        "rationale": body.rationale,
        "decidedBy": body.decidedBy,
        "decidedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "evidenceSnapshotId": f"snap-{int(time.time() * 1000)}",
        "evidenceSnapshot": body.evidenceSnapshot,
    }
    _decisions.insert(0, decision)
    return {"decision": decision}


class WeightsBody(BaseModel):
    weights: dict


@app.get("/api/weights/{compound_id}")
async def get_weights(compound_id: str):
    return {"weights": _weights.get(compound_id)}


@app.post("/api/weights/{compound_id}")
async def save_weights(compound_id: str, body: WeightsBody):
    _weights[compound_id] = body.weights
    return {"weights": body.weights}


@app.get("/api/domino/project")
async def domino_project():
    headers = get_auth_headers()
    if not headers or not DOMINO_API_HOST or not DOMINO_PROJECT_ID:
        raise HTTPException(status_code=503, detail="Domino backend not configured")
    try:
        r = requests.get(
            f"{DOMINO_API_HOST}/v4/projects/{DOMINO_PROJECT_ID}",
            headers=headers,
            timeout=10,
        )
        r.raise_for_status()
        return r.json()
    except Exception as e:
        print(f"[domino_project] {e}\n{traceback.format_exc()}", file=sys.stdout, flush=True)
        raise HTTPException(status_code=502, detail=str(e))


app.mount("/", StaticFiles(directory=WEB_DIR, html=True), name="static")
