# VittSetu
Citizen-facing platform for the NSFDC Scheduled Caste concessional-credit ecosystem.

[![React](https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white&style=for-the-badge)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite&logoColor=white&style=for-the-badge)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css&logoColor=white&style=for-the-badge)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/Zustand-5-brown?logo=react&logoColor=white&style=for-the-badge)](https://zustand-demo.pmnd.rs/)

## Project overview

VittSetu connects citizens with appropriate NSFDC credit schemes through a localized, accessible interface. Rather than expecting users to navigate complex policy documents, the platform provides interactive scheme recommenders, EMI calculators, and partner locators. To ensure multi-language support across India without leaking credentials, all interactions with the Bhashini translation/TTS APIs are securely proxied through a Vite middleware backend.

## Workflow

1. **User Input:** A citizen provides basic demographic and financial information via the `SchemeRecommender` components.
2. **Localization:** The `LanguageSwitcher` updates the UI via `i18next`. If a specific translation or text-to-speech request is needed, it calls the local `/api/bhashini` proxy.
3. **API Proxy:** The Vite middleware in `server/bhashiniProxy.js` intercepts the request, attaches the secure `BHASHINI_API_KEY`, and forwards it to the Bhashini model pipeline.
4. **Recommendation:** The frontend rules engine (`src/engine/schemeRules.js`) processes the citizen's data and returns the best matching NSFDC concessional-credit schemes.

## Features

- **Offline-First Capabilities:** Utilizes `vite-plugin-pwa` to cache core flows (schemes, calculators, app shell) using `StaleWhileRevalidate` and `CacheFirst` strategies.
- **Secure API Proxying:** Protects Bhashini API credentials by routing translation and TTS requests through a Vite development middleware.
- **Dynamic Localization:** Supports 20+ Indian languages using the Bhashini model pipelines and `i18next`.
- **Location & Mapping:** Integrated `leaflet` and `react-leaflet` to display nearby verified NSFDC partners.

## Repository structure

```text
.
├── server/
│   └── bhashiniProxy.js        # Vite middleware proxy for Bhashini APIs
├── src/
│   ├── components/             # Reusable React components (calculators, layout, ui)
│   ├── data/                   # Mock JSON data and scheme configurations
│   ├── engine/                 # Core logic for EMI calculation and scheme rules
│   ├── locales/                # i18next translation JSON files (20+ languages)
│   ├── pages/                  # Top-level React route components
│   └── services/               # API and state orchestration logic
├── vite.config.js              # Vite configuration including PWA and Proxy setup
└── package.json
```

## Configuration

The application requires specific environment variables for Bhashini integrations. Copy `.env.example` to `.env.local` to get started.

| Variable | Required | Purpose |
| :--- | :--- | :--- |
| `BHASHINI_USER_ID` | Yes | Identifier for the Bhashini API account. |
| `BHASHINI_API_KEY` | Yes | Secret token for Bhashini model access. |
| `BHASHINI_PIPELINE_ID` | Yes | Target pipeline ID for translation/TTS tasks. |

*Note: Do not prefix these with `VITE_` to ensure they are strictly kept on the server.*

## Run locally

**Prerequisites:** Node.js (v18+) and npm.

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your actual Bhashini credentials

# 3. Start the development server (runs both frontend and API proxy)
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## API contract

The local Vite server exposes the following proxy endpoints under `/api/bhashini`:

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `GET` | `/status` | Checks if the Bhashini credentials are fully configured. |
| `POST` | `/translate` | Translates a batch of texts. Body: `{ sourceLanguage, targetLanguage, texts: [string] }` |
| `POST` | `/tts` | Converts text to speech. Body: `{ language, text }` |

## Scope and limitations

- **Test-Mode Proxying:** The Bhashini proxy currently runs as a Vite middleware for development purposes. A standalone Node/Express server or serverless function is required for production deployments.
- **No Persistent Backend:** Currently uses local state (`Zustand`) and mock data (`src/data/*.mock.json`). User data and applications are not persisted across browser sessions.
- **Restricted Routing:** The proxy will reject any request to `/api/bhashini` that isn't `GET /status`, `POST /translate`, or `POST /tts` with a `404` or `405`.
