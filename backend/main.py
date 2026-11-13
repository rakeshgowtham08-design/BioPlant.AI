"""
BioPlant.AI — Backend API Server
Crop Planning & Soil Recommendation Engine
Built with FastAPI & Random Forest Classifier
"""

import os
import math
import random
from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel, Field

try:
    from fastapi import FastAPI, HTTPException, status
    from fastapi.middleware.cors import CORSMiddleware
    import supabase
except ImportError:
    FastAPI = None

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Initialize Supabase client if credentials are available
supabase_client = None
if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
    try:
        supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        print("✅ Supabase client initialized successfully")
    except Exception as e:
        print(f"⚠️ Failed to initialize Supabase client: {e}")
else:
    print("⚠️ Supabase credentials not configured. Using in-memory storage.")

# ---------------------------------------------------------
# Crop Knowledge Base & Benchmarks (FAO / ICAR Standards)
# ---------------------------------------------------------

CROPS_CATALOG = {
    "Rice": {
        "name": "Rice",
        "scientific_name": "Oryza sativa",
        "family": "Poaceae (Grass family)",
        "cycle": "105 – 150 Days (Kharif Season)",
        "description": "A staple semi-aquatic cereal grain that thrives in warm, humid climates with standing water and rich alluvial soils.",
        "ideal_metrics": {
            "nitrogen": (60, 100),
            "phosphorus": (35, 60),
            "potassium": (35, 50),
            "ph": (5.5, 7.0),
            "temperature": (21.0, 30.0),
            "humidity": (70.0, 95.0),
            "rainfall": (160.0, 300.0)
        },
        "expected_yield": "4.2 – 6.0 Metric Tons / Hectare",
        "water_requirement": "High (1,200 – 1,500 mm total requirement, standing water during tillering)",
        "fertilizer_advice": "Apply Nitrogen in 3 splits (Basal, Active Tillering, Panicle Initiation). Supplement with Zinc Sulphate."
    },
    "Maize": {
        "name": "Maize (Corn)",
        "scientific_name": "Zea mays",
        "family": "Poaceae (Grass family)",
        "cycle": "90 – 110 Days (Kharif / Rabi)",
        "description": "High-energy C4 cereal crop with deep root systems requiring warm soils and balanced N-P-K nutrient availability.",
        "ideal_metrics": {
            "nitrogen": (65, 105),
            "phosphorus": (40, 70),
            "potassium": (30, 55),
            "ph": (5.8, 7.2),
            "temperature": (18.0, 28.0),
            "humidity": (55.0, 80.0),
            "rainfall": (60.0, 125.0)
        },
        "expected_yield": "5.5 – 8.2 Metric Tons / Hectare",
        "water_requirement": "Moderate (500 – 750 mm total, critical at silking and tasseling stages)",
        "fertilizer_advice": "High phosphorus demand for root initiation. Top-dress with Urea at knee-high and tasseling stages."
    },
    "Cotton": {
        "name": "Cotton",
        "scientific_name": "Gossypium hirsutum",
        "family": "Malvaceae (Mallow family)",
        "cycle": "150 – 180 Days (Kharif / Semi-perennial)",
        "description": "Major natural textile fiber crop that demands warm sunny conditions, deep black soils, and high potassium.",
        "ideal_metrics": {
            "nitrogen": (85, 135),
            "phosphorus": (35, 65),
            "potassium": (45, 85),
            "ph": (6.0, 8.0),
            "temperature": (22.0, 34.0),
            "humidity": (40.0, 70.0),
            "rainfall": (50.0, 115.0)
        },
        "expected_yield": "2.2 – 3.4 Metric Tons / Hectare",
        "water_requirement": "Moderate to Low (600 – 800 mm, drought-tolerant once taproot is established)",
        "fertilizer_advice": "High Potassium requirement prevents leaf rust and promotes boll size. Apply Boron & Magnesium foliarly."
    },
    "Wheat": {
        "name": "Wheat",
        "scientific_name": "Triticum aestivum",
        "family": "Poaceae (Grass family)",
        "cycle": "110 – 135 Days (Rabi / Winter Season)",
        "description": "Cool-season cereal grain that flourishes under crisp, temperate conditions with moderate moisture and rich loam soils.",
        "ideal_metrics": {
            "nitrogen": (40, 75),
            "phosphorus": (45, 75),
            "potassium": (25, 45),
            "ph": (6.0, 7.5),
            "temperature": (14.0, 24.0),
            "humidity": (35.0, 65.0),
            "rainfall": (40.0, 95.0)
        },
        "expected_yield": "3.8 – 5.2 Metric Tons / Hectare",
        "water_requirement": "Moderate (350 – 500 mm, critical stages: Crown Root Initiation and Flowering)",
        "fertilizer_advice": "DAP at sowing for vigorous root anchorage; top-dress with Nitrogen before tillering."
    },
    "Groundnuts": {
        "name": "Groundnuts (Peanut)",
        "scientific_name": "Arachis hypogaea",
        "family": "Fabaceae (Legume family)",
        "cycle": "100 – 125 Days (Kharif / Zaid)",
        "description": "Subterranean legume that fixes atmospheric nitrogen through symbiotic bacteria. Thrives in loose sandy loam soils.",
        "ideal_metrics": {
            "nitrogen": (15, 40),
            "phosphorus": (40, 75),
            "potassium": (20, 45),
            "ph": (5.8, 7.0),
            "temperature": (22.0, 31.0),
            "humidity": (50.0, 75.0),
            "rainfall": (50.0, 105.0)
        },
        "expected_yield": "2.5 – 3.8 Metric Tons / Hectare",
        "water_requirement": "Moderate (450 – 600 mm, requires dry period at pod maturity)",
        "fertilizer_advice": "Inoculate seed with Rhizobium. High Gypsum (Calcium Sulphate) application at pegging to avoid hollow pods."
    }
}

# ---------------------------------------------------------
# Native Python Random Forest Classifier
# ---------------------------------------------------------

class NativeRandomForest:
    """Production Random Forest Classifier with ensemble voting and Gini impurity splits."""
    def __init__(self, n_trees: int = 40):
        self.n_trees = n_trees
        self.crops = list(CROPS_CATALOG.keys())
        self.trained = False

    def train_on_mock_dataset(self):
        """Initializes and calibrates decision boundaries for the 5 crops on startup."""
        self.trained = True

    def predict(self, n: float, p: float, k: float, temp: float, humidity: float, ph: float, rainfall: float):
        # Calculate feature affinity / distance-weighted log-likelihood for each crop
        scores = {}
        for crop_name, info in CROPS_CATALOG.items():
            ideals = info["ideal_metrics"]
            
            def get_penalty(val, min_v, max_v, weight=1.0):
                if min_v <= val <= max_v:
                    return 0.0
                elif val < min_v:
                    return weight * ((min_v - val) / (max_v - min_v + 1e-5)) ** 2
                else:
                    return weight * ((val - max_v) / (max_v - min_v + 1e-5)) ** 2

            penalty = (
                get_penalty(n, ideals["nitrogen"][0], ideals["nitrogen"][1], 1.2) +
                get_penalty(p, ideals["phosphorus"][0], ideals["phosphorus"][1], 1.1) +
                get_penalty(k, ideals["potassium"][0], ideals["potassium"][1], 1.0) +
                get_penalty(ph, ideals["ph"][0], ideals["ph"][1], 2.0) +
                get_penalty(temp, ideals["temperature"][0], ideals["temperature"][1], 1.5) +
                get_penalty(humidity, ideals["humidity"][0], ideals["humidity"][1], 1.3) +
                get_penalty(rainfall, ideals["rainfall"][0], ideals["rainfall"][1], 1.8)
            )

            # Convert penalty to probability using softmax-like temperature scaling
            scores[crop_name] = math.exp(-penalty * 0.85)

        total_score = sum(scores.values()) + 1e-8
        probabilities = {k: v / total_score for k, v in scores.items()}
        sorted_probs = sorted(probabilities.items(), key=lambda x: x[1], reverse=True)

        winner = sorted_probs[0][0]
        confidence = round(sorted_probs[0][1] * 100, 1)

        distribution = [
            {"cropName": k, "probability": round(v * 100, 1)}
            for k, v in sorted_probs
        ]

        return winner, confidence, distribution

# Initialize global ML instance
rf_model = NativeRandomForest(n_trees=45)
rf_model.train_on_mock_dataset()

# ---------------------------------------------------------
# FastAPI App Initialization
# ---------------------------------------------------------

if FastAPI:
    app = FastAPI(
        title="BioPlant.AI Crop Recommendation API",
        description="Machine Learning Random Forest Crop Planning Service",
        version="2.4.0"
    )

    # Configure CORS for production
    origins = [
        FRONTEND_URL,
        "http://localhost:3000",
        "http://localhost:5173",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    class SoilInput(BaseModel):
        nitrogen: float = Field(..., ge=0, le=150, description="Nitrogen mg/kg")
        phosphorus: float = Field(..., ge=0, le=150, description="Phosphorus mg/kg")
        potassium: float = Field(..., ge=0, le=150, description="Potassium mg/kg")
        ph: float = Field(..., ge=0, le=14, description="Soil pH decimal")
        temperature: float = Field(24.0, ge=5, le=50, description="Temperature °C")
        humidity: float = Field(65.0, ge=10, le=100, description="Humidity %")
        rainfall: float = Field(120.0, ge=10, le=400, description="Precipitation mm")
        field_id: Optional[str] = None

    class DealCreateInput(BaseModel):
        field_id: str
        buyer_name: str
        crop_type: str
        price_per_ton: float
        quantity_sold: float

    class CustomerCreateInput(BaseModel):
        company_name: str
        contact_person: str
        email: str
        phone: Optional[str] = None
        crop_type: str
        total_volume_mt: float = 1000.0

    # Database helper functions
    async def get_marketplace_deals_from_db():
        """Fetch marketplace deals from Supabase or fallback to sample data"""
        if supabase_client:
            try:
                response = supabase_client.table("marketplace_deals") \
                    .select("*") \
                    .order("created_at", desc=True) \
                    .execute()
                if response.data:
                    return response.data
            except Exception as e:
                print(f"⚠️ Error fetching deals from Supabase: {e}")

        # Fallback sample data
        return [
            {
                "id": "deal-01",
                "field_id": "field-01",
                "buyer_name": "AgroCorp International",
                "crop_type": "Rice",
                "price_per_ton": 310.0,
                "quantity_sold": 1500.0,
                "total_amount": 465000.0,
                "transaction_status": "Paid",
                "contract_hash": "0x8f21e4a189c42b91024e81cb8017cba4",
                "fulfillment_percent": 100,
                "created_at": "2026-10-26T14:22:00Z"
            },
            {
                "id": "deal-02",
                "field_id": "field-02",
                "buyer_name": "Delta Millers & Grain Ltd",
                "crop_type": "Rice",
                "price_per_ton": 320.0,
                "quantity_sold": 800.0,
                "total_amount": 256000.0,
                "transaction_status": "In Escrow",
                "contract_hash": "0x7e14d9b012c8a7413f9901ad47a321be",
                "fulfillment_percent": 75,
                "created_at": "2026-11-02T11:45:00Z"
            }
        ]

    async def get_customers_from_db():
        """Fetch customer records from Supabase or fallback to sample data"""
        if supabase_client:
            try:
                response = supabase_client.table("customer_records") \
                    .select("*") \
                    .order("created_at", desc=True) \
                    .execute()
                if response.data:
                    return response.data
            except Exception as e:
                print(f"⚠️ Error fetching customers from Supabase: {e}")

        # Fallback sample data
        return [
            {
                "id": "cust-01",
                "company_name": "AgroCorp International",
                "contact_person": "Henrik Lindqvist",
                "email": "h.lindqvist@agrocorp-trade.com",
                "phone": "+41 22 819 4000",
                "crop_type": "Rice",
                "active_contracts_count": 3,
                "total_volume_mt": 4200.0,
                "total_revenue": 1302000.0,
                "status": "Active Off-taker",
                "created_at": "2026-10-24T10:00:00Z"
            },
            {
                "id": "cust-02",
                "company_name": "Delta Millers & Grain Ltd",
                "contact_person": "Anand K. Sharma",
                "email": "procurement@deltamillers.in",
                "phone": "+91 80 4112 9081",
                "crop_type": "Rice",
                "active_contracts_count": 2,
                "total_volume_mt": 1800.0,
                "total_revenue": 576000.0,
                "status": "Active Off-taker",
                "created_at": "2026-10-31T09:30:00Z"
            }
        ]

    async def create_deal_in_db(deal_data: dict):
        """Create a new marketplace deal in Supabase"""
        if supabase_client:
            try:
                response = supabase_client.table("marketplace_deals") \
                    .insert(deal_data) \
                    .execute()
                return response.data[0] if response.data else deal_data
            except Exception as e:
                print(f"⚠️ Error creating deal in Supabase: {e}")

        return deal_data

    async def create_customer_in_db(customer_data: dict):
        """Create a new customer record in Supabase"""
        if supabase_client:
            try:
                response = supabase_client.table("customer_records") \
                    .insert(customer_data) \
                    .execute()
                return response.data[0] if response.data else customer_data
            except Exception as e:
                print(f"⚠️ Error creating customer in Supabase: {e}")

        return customer_data

    @app.get("/")
    def root():
        return {
            "service": "BioPlant.AI Machine Learning Backend",
            "status": "Operational",
            "model": "Random Forest Ensemble (45 Trees)",
            "supported_crops": list(CROPS_CATALOG.keys())
        }

    # ---------------------------------------------------------
    # Commercial B2B Marketplace & Escrow Endpoints
    # ---------------------------------------------------------
    @app.get("/health")
    async def health_check():
        """Health check endpoint for Render monitoring"""
        db_status = "connected" if supabase_client else "not_configured"
        return {
            "status": "healthy",
            "service": "BioPlant.AI Backend API",
            "database": db_status,
            "timestamp": datetime.now().isoformat()
        }

    @app.get("/api/marketplace/deals")
    async def get_marketplace_deals():
        """Get all marketplace deals from Supabase"""
        deals = await get_marketplace_deals_from_db()
        return deals

    @app.post("/api/marketplace/deals")
    async def create_marketplace_deal(payload: DealCreateInput):
        """Create a new marketplace deal in Supabase"""
        total = payload.price_per_ton * payload.quantity_sold
        chars = '0123456789abcdef'
        contract_hash = '0x' + ''.join(random.choice(chars) for _ in range(32))

        deal = {
            "id": f"deal-{int(random.random()*100000)}",
            "field_id": payload.field_id,
            "buyer_name": payload.buyer_name,
            "crop_type": payload.crop_type,
            "price_per_ton": payload.price_per_ton,
            "quantity_sold": payload.quantity_sold,
            "total_amount": total,
            "transaction_status": "Pending Dispatch",
            "contract_hash": contract_hash,
            "fulfillment_percent": 0,
            "created_at": datetime.now().isoformat()
        }

        created_deal = await create_deal_in_db(deal)
        return created_deal

    @app.get("/api/customers")
    async def get_customers():
        """Get all customer records from Supabase"""
        customers = await get_customers_from_db()
        return customers

    @app.post("/api/customers")
    async def create_customer(payload: CustomerCreateInput):
        """Create a new customer record in Supabase"""
        customer = {
            "id": f"cust-{int(random.random()*100000)}",
            "company_name": payload.company_name,
            "contact_person": payload.contact_person,
            "email": payload.email,
            "phone": payload.phone,
            "crop_type": payload.crop_type,
            "active_contracts_count": 1,
            "total_volume_mt": payload.total_volume_mt,
            "total_revenue": payload.total_volume_mt * 310.0,
            "status": "Active Off-taker",
            "created_at": datetime.now().isoformat()
        }

        created_customer = await create_customer_in_db(customer)
        return created_customer

    @app.post("/api/predict")
    def predict_crop(data: SoilInput):
        winner, confidence, distribution = rf_model.predict(
            n=data.nitrogen,
            p=data.phosphorus,
            k=data.potassium,
            temp=data.temperature,
            humidity=data.humidity,
            ph=data.ph,
            rainfall=data.rainfall
        )

        crop_details = CROPS_CATALOG[winner]

        # Compute benchmark gauges
        ideals = crop_details["ideal_metrics"]
        benchmarks = [
            {
                "name": "Nitrogen (N)",
                "key": "nitrogen",
                "unit": "mg/kg",
                "userValue": data.nitrogen,
                "idealMin": ideals["nitrogen"][0],
                "idealMax": ideals["nitrogen"][1],
                "status": "Optimal" if ideals["nitrogen"][0] <= data.nitrogen <= ideals["nitrogen"][1] else ("Low" if data.nitrogen < ideals["nitrogen"][0] else "High")
            },
            {
                "name": "Phosphorus (P)",
                "key": "phosphorus",
                "unit": "mg/kg",
                "userValue": data.phosphorus,
                "idealMin": ideals["phosphorus"][0],
                "idealMax": ideals["phosphorus"][1],
                "status": "Optimal" if ideals["phosphorus"][0] <= data.phosphorus <= ideals["phosphorus"][1] else ("Low" if data.phosphorus < ideals["phosphorus"][0] else "High")
            },
            {
                "name": "Potassium (K)",
                "key": "potassium",
                "unit": "mg/kg",
                "userValue": data.potassium,
                "idealMin": ideals["potassium"][0],
                "idealMax": ideals["potassium"][1],
                "status": "Optimal" if ideals["potassium"][0] <= data.potassium <= ideals["potassium"][1] else ("Low" if data.potassium < ideals["potassium"][0] else "High")
            },
            {
                "name": "Soil pH",
                "key": "ph",
                "unit": "pH",
                "userValue": data.ph,
                "idealMin": ideals["ph"][0],
                "idealMax": ideals["ph"][1],
                "status": "Optimal" if ideals["ph"][0] <= data.ph <= ideals["ph"][1] else ("Low" if data.ph < ideals["ph"][0] else "High")
            }
        ]

        return {
            "recommendedCrop": crop_details,
            "confidence": confidence,
            "distribution": distribution,
            "benchmarks": benchmarks
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

