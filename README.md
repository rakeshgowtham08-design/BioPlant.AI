# 🌱 BioPlant.AI — AI-Powered Crop Planning & Recommendation System

**BioPlant.AI** is a production-ready, ultra-modern biotech web application designed for agricultural scientists, agronomists, and farm managers. It pairs precision soil chemistry assays ($N, P, K, \text{pH}$) with simulated localized microclimate vectors (Temperature, Humidity, Precipitation) through a native **Random Forest Classification Engine** to recommend optimal crops, benchmark soil imbalances with interactive gauges, prescribe agronomic protocols, and execute direct wholesale cargo sales to global off-takers via cryptographic smart-contract escrow.

---

## 🚀 Live Access & Quick Start

The application is running and accessible in your web browser:
👉 **[http://localhost:3000](http://localhost:3000)**

### To start or restart the server manually:
```bash
# Start frontend application (Vite Dev Server)
npm run dev

# Or build for production
npm run build
npm run preview
```

---

## 🎨 1. Five Core Panels & Navigation Architecture

BioPlant.AI features a unified, floating 5-tab navigation bar:
**Overview | Diagnostics | AI Insights | Marketplace | Customers**

### Panel 1: Field Dashboard (`Overview`)
- **Senior Agronomist Profile**: Dr. Elena Vance with active sector designation.
- **Interactive Field Switcher Dropdown**: Select between 4 distinct parcels (*North Ridge Valley Parcel #08*, *Delta Lowlands #02*, *Highland Terrace #14*, *Greenhouse Alpha #01*).
- **Interactive Atmospheric Local & 7-Day Predictive Weather Forecasting**:
  - Live sensor telemetry (Air Temp, Ambient RH, 24h Precip, Solar Rad, Wind Flow, Barometer).
  - 7-Day Predictive Chart with selectable day cards, max/min temperature trajectory graph, and agricultural advisories.
  - Actionable farming micro-cards:
    * **Optimal Spraying Windows (Wind < 15km/h)** with safe drift timelines.
    * **Evapotranspiration Index ($ET_0\text{ mm/day}$)** with pulse drip replenishment guidance.
    * **Impending Soil Frost Alerts** with thermal barrier buffer analysis.
- **Bio-Spectral Aerial NDVI Imagery**: 0.82 NDVI Vegetative Health rating.
- **Harvest Projection & Sensor Mesh Grids**: Real-time tonnage projections and node telemetry status.
- **Active Field History Logbook**: Click any past run to load its exact soil parameters into Diagnostics.
- **CTA**: Prominent *"Run BioPlant Intelligence"* button.

### Panel 2: Diagnostics Form (`Diagnostics`)
- **Quick-Fill Presets**: One-click archetypes (*Optimal Rice Baseline*, *High-Nitrogen Maize*, *Arid Cotton*, *Cool Wheat*, *Sandy Groundnuts*).
- **NPK Macronutrient Sliders ($0 - 150\text{ mg/kg}$)**: Smooth sliders with instant numeric feedback and dynamic quality badges (*Optimal*, *High*, *Critical*).
- **Continuous Soil pH Spectrum Slider ($0.0 - 14.0$)**:
  - Visual color spectrum gradient with floating indicator pip.
  - Dynamic Amber/Error Diagnostic Alert card diagnosing Acidity, Neutral, or Alkalinity with remediation protocols.
- **Atmospheric Sliders & Sync**: Temperature ($10-50^\circ\text{C}$), Humidity ($10-100\%$), Rainfall ($0-400\text{ mm}$), plus a **"Sync Station Telemetry"** button.
- **Real-Time Top Candidate Preview**: Dynamic calculation as parameters change.
- **Action**: *"Execute ML Diagnostic & Recommendation"*.

### Panel 3: Recommendation Results (`AI Insights`)
- **Hero Recommendation Badge**: Winning crop with scientific taxonomy and animated circular radial progress gauge ($94.8\%$ Score).
- **Dual Gauge Field vs. Ideal Comparison Matrix**:
  - Visual comparison bars with ideal pip markers for $N$, $P$, $K$, $\text{pH}$, Rain, and Temperature.
  - View toggle: Standard vs. Dual Gauge Normalized Relative Variance.
- **5-Crop Affinity Distribution**: Full suitability ranking with probability bars and status tags.
- **Agronomic Directives**: Recommended Seeding Schedule, Precision Fertilizer Formulation, and Irrigation Depth Management.
- **Actions**:
  - *"Sell Recommended Cargo Directly on Marketplace"*
  - *"Download Agronomic Plan (PDF)"* (`window.print()`)
  - *"Simulate Alternative Field or Climate"*
  - *"Save Recommendation to Field Logbook"* with animated toast feedback.

### Panel 4: B2B Crop Direct Marketplace (`Marketplace`)
- **Wholesale Off-taker Network**: Verified global commodity aggregators and food processing syndicates (*AgroCorp International*, *Delta Millers*, *Global Grains Consortium AG*, *Cargill*, *Pacific Harvest Fiber Co.*, *Olam Agro*).
- **Live Bidding Cards**:
  - Buyer Name & Verified Tier (e.g. *AAA Sovereign Verified*).
  - Bidding Price (e.g. *$310 / Metric Ton*).
  - Demanded Quantity (e.g. *2,500 MT*).
  - Quality Spec Tier (e.g. *Grade A Export Spec #1*).
  - Delivery Terms (*FOB Port*, *Ex-Farm Gate Direct*).
  - Settlement: *100% Escrow Guaranteed via Smart Contract*.
- **"Sell Cargo Directly" Action**: Launches the **"Authorize Cargo Escrow Transfer"** modal:
  - Cryptographic smart-contract handshake simulation with hash key and gas validation.
  - Cargo weight entry field (in Metric Tons) with instant total net payout calculation.
  - Harvest parcel selector.
  - **"Initiate Instant Payout"** trigger committing deal to Supabase ledger with status `'Pending Dispatch'`.

### Panel 5: Customer & Contract Portal (`Customers`)
- **Top Commercial Metric Cards**:
  - **Total Revenue Generated** (e.g. *$842,500* with $+18.4\%$ trend badge).
  - **Pending Escrow Release** (e.g. *$186,000* locked in smart vault).
  - **Active Logistics Contracts** (e.g. *12 Active Deals*).
- **Commercial Cargo Deals Table**:
  - Buyer name, crop type, quantity (MT), rate, and total payout.
  - Order fulfillment progress bars.
  - Status badges: `Pending Dispatch`, `In Escrow`, `Dispatched`, `Paid`.
  - Smart-contract verification hash and date.
- **"+ Add Customer" Side-Drawer**:
  - Modal form to manually register contractual off-taker buyers into `customer_records`.

---

## 🌲 2. Machine Learning Engine (Random Forest)

- **Pure TypeScript/JavaScript Native Execution**: Runs directly inside the browser with zero external dependencies and sub-$5\text{ms}$ latency.
- **Ensemble Architecture**:
  - $45$ independent Decision Trees.
  - **Bootstrap Bagging**: Each tree is trained on random subsamples with replacement.
  - **Feature Subsampling**: Evaluates $m = \sqrt{M}$ random features at every branch split.
  - **Gini Impurity Partitioning**: Optimizes purity at every tree node.
  - **Ensemble Voting & Softmax Normalization**: Aggregates class probabilities to compute the winning recommendation and exact confidence score.
- **Foundational Agricultural Crop Classes**:
  1. **Rice** (*Oryza sativa*): High moisture, Kharif monsoon, alluvial soils.
  2. **Maize** (*Zea mays*): Warm temperate plains, high phosphorus, moderate moisture.
  3. **Cotton** (*Gossypium hirsutum*): Warm sunny climate, high potassium, deep black vertisols.
  4. **Wheat** (*Triticum aestivum*): Cool crisp temperate winter (Rabi), rich phosphorus loam.
  5. **Groundnuts** (*Arachis hypogaea*): Nitrogen-fixing legume, loose sandy loam, moderate rainfall.

---

## 💾 3. Supabase Schema & Database Integration

The application includes full Supabase PostgreSQL schemas in [`supabase/schema.sql`](file:///Users/rakeshgowthamsetti/bioplant.ai/supabase/schema.sql):

- **Table `marketplace_deals`**:
  `id`, `field_id`, `buyer_name`, `crop_type`, `price_per_ton`, `quantity_sold`, `total_amount`, `transaction_status`, `contract_hash`, `fulfillment_percent`, `created_at`.
- **Table `customer_records`**:
  `id`, `company_name`, `contact_person`, `email`, `phone`, `crop_type`, `active_contracts_count`, `total_volume_mt`, `total_revenue`, `status`, `created_at`.

### Client Handler (`src/services/supabaseService.ts`):
- Connects to Supabase when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are provided.
- Seamlessly falls back to reactive local storage with `localStorage` persistence and cross-component event broadcasting so that deals and customers function out of the box with zero configuration!

---

## 🏛️ 4. Level 1 Data Flow Diagram (DFD)

BioPlant.AI includes an interactive **Level 1 DFD Modal** accessible via the navbar button:
```
[User & Soil Sensors] ──(N, P, K, pH)────────┐
                                              ▼
                                   ┌─────────────────────┐
[Weather Service] ──(Temp, Hum, Rain)─▶│ Preprocessing &     │
                                   │ Feature Vectorization│
                                   └──────────┬──────────┘
                                              ▼
                                   ┌─────────────────────┐
                                   │ Random Forest (45T) │
                                   │ Ensemble Classifier │
                                   └──────────┬──────────┘
                                              ▼
                                   ┌─────────────────────┐
                                   │ Benchmark Mapping & │
                                   │ Multi-Gauge Scoring │
                                   └──────────┬──────────┘
                                              ▼
[B2B Crop Marketplace] ◀──(Recommended Crop)──┼──▶ [Results Presentation]
         │                                    
         ▼ (Escrow Authorization)             
[Supabase Ledger: marketplace_deals] ──▶ [Customer & Contract Portal]
```

---

## 📦 5. Standalone Python FastAPI Backend

Located in [`backend/main.py`](file:///Users/rakeshgowthamsetti/bioplant.ai/backend/main.py):
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Provides REST API endpoints:
- `POST /api/predict`: Random forest inference
- `GET /api/marketplace/deals` & `POST /api/marketplace/deals`
- `GET /api/customers` & `POST /api/customers`
