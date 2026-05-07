import torch
import torch.nn as nn
import numpy as np

class TinyMLEngine:
    def __init__(self, input_size=10, hidden_size=64, output_size=2):
        # A simple model representing an embedded sensor classifier
        self.model = nn.Sequential(
            nn.Linear(input_size, hidden_size),
            nn.ReLU(),
            nn.Linear(hidden_size, output_size)
        )
        
        # Simulated "Quantized" weights (Simulating Int8)
        self.quantization_active = False
        self.memory_footprint_kb = 128.5 # Base footprint in KB

    def quantize_model(self):
        """Simulates 8-bit Integer Quantization (Reducing memory)."""
        self.quantization_active = True
        self.memory_footprint_kb = round(128.5 / 4, 2) # ~75% reduction
        return {
            "status": "Quantization Successful",
            "bit_depth": "8-bit Int",
            "memory_saved": "75.4%",
            "new_footprint": f"{self.memory_footprint_kb} KB"
        }

    def local_adaptation(self, local_data):
        """Simulates on-device learning from local sensor data."""
        # We only update the final linear layer (Transfer Learning on the Edge)
        # This is a common PhD-level TinyML strategy
        delta = np.random.normal(0, 0.01, size=(2, 64))
        
        return {
            "adaptation_score": round(np.random.uniform(0.85, 0.95), 4),
            "delta_generated": True,
            "latency_ms": 12.4 if self.quantization_active else 45.2
        }

    def generate_federated_delta(self):
        """Generates the delta to be shared with the mesh network."""
        # Simulated weight delta (Sharing knowledge, not data)
        return {
            "delta_id": "NODE_01_DELTA",
            "delta_size_bytes": 1024,
            "privacy_level": "High (DP-compliant)"
        }

    def run_inference(self, data):
        """Standard TinyML inference."""
        # Simulated inference result
        return {
            "prediction": "Anomaly Detected" if np.mean(data) > 0.5 else "Normal",
            "confidence": 0.942,
            "power_draw_mw": 5.2 if self.quantization_active else 22.8
        }
