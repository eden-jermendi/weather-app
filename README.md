# Weather App (Backend-First Practice Project)

A small full-stack weather app built primarily to practice backend fundamentals in a realistic environment.

This project is intentionally constrained. The goal is not to build a production-grade weather platform, but to strengthen backend instincts while maintaining a minimal, functional frontend.

---

## Core Intent

### Backend-first focus

The primary purpose of this project is to practice:

- Designing and exposing clean HTTP API endpoints
- Working with third-party APIs (OpenWeather)
- Managing API keys securely using environment variables (`.env`)
- Using a server-side proxy to prevent exposing secrets in the browser
- Validating query parameters
- Shaping and normalizing API responses before sending them to the client
- Understanding request/response flow end-to-end

The backend is the main learning surface.

---

### Frontend philosophy

The frontend exists to:

- Consume the backend API
- Display key weather fields clearly
- Stay minimal and readable
- Maintain basic visual balance without advanced styling

No UI libraries.  
No over-architecture.  
No unnecessary abstractions.

The frontend should remain a thin client unless a feature directly supports backend learning.

---

## Current Features

### Backend

- `GET /v1/weather/current`
- Query params:
  - `city`
  - `units`
- Returns normalized weather data:
  - `tempC`
  - `feelsLikeC`
  - `humidityPct`
  - `windSpeed`
  - `windDeg`
  - `summary`
  - `timeUtc`
  - `locationName`
  - `country`

### Frontend

- Fetches weather data via Vite proxy
- Displays:
  - Temperature (°C)
  - Feels like (°C)
  - Humidity (%)
  - Wind speed + compass direction
  - Weather summary + simple emoji
- No advanced state management
- No component splitting (intentional MVP scope)

---

## Tech Stack

### Backend
- Node.js
- Express
- TypeScript
- dotenv
- OpenWeather API

### Frontend
- Vite
- React
- TypeScript

---

## Local Development

### Run backend

```bash

cd server
npm install
npm run dev
```

Runs on: http://localhost:3000

## Run frontend
```
cd client
npm install
npm run dev
```

Runs on: http://localhost:5173

Vite is configured with a proxy:

- /v1 → http://localhost:3000

This prevents CORS issues and keeps API keys server-side.

---

## Design Constraints

This project intentionally avoids:

- Advanced UI systems
- State management libraries
- Over-engineered folder structures
- Premature optimization

It is a backend practice playground with a functional UI.

---

## Future Directions (Flexible)

Possible next phases may include:

- Adding more weather fields from the API
- Implementing validation and structured error responses
- Adding rate limiting or simple caching
- Introducing loading/error states in the frontend
- Adding city search input
- Improving layout while keeping scope controlled

The project evolves incrementally, guided by backend learning goals.
