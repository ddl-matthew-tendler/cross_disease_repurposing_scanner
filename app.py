import os
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEB_DIR = os.path.join(BASE_DIR, "web")

_decisions: list = []
_weights: dict = {}


@asynccontextmanager
async def lifespan(app):
    yield


app = FastAPI(title="Cross-Disease Repurposing Scanner", lifespan=lifespan)


@app.get("/api/health")
async def health():
    return {"status": "ok", "connected": True}


@app.get("/api/portfolio")
async def portfolio():
    # Real integration would pull from sponsor compound DB via read-only service account.
    # For POC the frontend uses MOCK_PORTFOLIO from mock_data.js.
    return {"compounds": []}


@app.get("/api/scan/{compound_id}")
async def scan(compound_id: str):
    # Real integration would query Open Targets GraphQL + ChEMBL + sponsor LIMS.
    return {"compound_id": compound_id, "indications": []}


@app.get("/api/dossier/{compound_id}/{indication_id}")
async def dossier(compound_id: str, indication_id: str):
    # Real integration: RAG over PubMed/bioRxiv corpus + Claude API (tenant-private).
    # Claude call stays within Domino tenant — no sponsor data leaves the boundary.
    # TODO: wire up anthropic sdk with prompt caching for dossier generation
    return {"compound_id": compound_id, "indication_id": indication_id, "dossier": None}


@app.get("/api/committee")
async def committee():
    return {"candidates": []}


@app.get("/api/dusty-shelf")
async def dusty_shelf():
    return {"compounds": []}


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


app.mount("/", StaticFiles(directory=WEB_DIR, html=True), name="static")
