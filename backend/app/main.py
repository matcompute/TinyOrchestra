from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
from app.services.tiny_engine import TinyMLEngine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="TinyOrchestra Mesh API")

# Enable CORS for the TinyML Dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = TinyMLEngine()

class NodeInput(BaseModel):
    data: list # Simulated sensor readings

@app.get("/")
def read_root():
    return {"status": "TinyOrchestra Online", "node_type": "Embedded Mesh Node"}

@app.post("/api/node/quantize")
def quantize_node():
    return engine.quantize_model()

@app.post("/api/node/adapt")
def adapt_node(input_data: NodeInput):
    # Process local learning
    result = engine.local_adaptation(input_data.data)
    return result

@app.get("/api/mesh/telemetry")
def get_mesh_telemetry():
    """Returns collective intelligence stats."""
    return {
        "nodes_active": 12,
        "global_accuracy": 0.92,
        "bandwidth_saved": "92.4%",
        "total_deltas_aggregated": 48
    }

@app.post("/api/node/inference")
def run_node_inference(input_data: NodeInput):
    return engine.run_inference(input_data.data)
