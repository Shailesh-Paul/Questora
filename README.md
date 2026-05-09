# Questora — Corporate Group Travel Ecosystem

## 🚀 Quick Start (Run This First)

```bash
# 1. Install all dependencies
npm install

# 2. Copy env file and fill in your API keys
cp .env.example .env.local

# 3. Start development server
npm start
```

---

## 📦 All NPM Installs

```bash
# Core
npm install react react-dom react-router-dom

# State management
npm install zustand

# Data fetching
npm install @tanstack/react-query axios

# UI / Interactions
npm install framer-motion lucide-react react-hot-toast

# Date handling
npm install date-fns react-datepicker

# Payment (when ready)
npm install razorpay

# Tailwind CSS
npm install -D tailwindcss autoprefixer postcss
npx tailwindcss init -p
```

---

## 🔑 API Keys — Where to Get Them

### 1. Google Maps + Places
- Go to: https://console.cloud.google.com/
- Enable: Maps JavaScript API, Places API, Geocoding API
- Create credentials → API Key
- Add to .env.local:
  ```
  REACT_APP_GOOGLE_MAPS_KEY=AIzaSy...
  ```

### 2. Amadeus (Hotels)
- Go to: https://developers.amadeus.com/
- Register → Create App → Get sandbox credentials (free)
- Add to .env.local:
  ```
  REACT_APP_AMADEUS_CLIENT_ID=...
  REACT_APP_AMADEUS_CLIENT_SECRET=...
  ```
- Switch to production when ready to go live

### 3. Viator (Activities)
- Go to: https://www.viator.com/partner
- Apply for API access (takes 1-2 days, mention hackathon)
- Add to .env.local:
  ```
  REACT_APP_VIATOR_API_KEY=...
  ```
- For hackathon: mock data in api.js works without this key

### 4. OpenWeatherMap (Weather)
- Go to: https://openweathermap.org/api
- Free tier: 1000 calls/day — more than enough
- Add to .env.local:
  ```
  REACT_APP_OPENWEATHER_KEY=...
  ```

### 5. Unsplash (Images)
- Go to: https://unsplash.com/developers
- Register application → Get Access Key (instant)
- Add to .env.local:
  ```
  REACT_APP_UNSPLASH_ACCESS_KEY=...
  ```

### 6. Razorpay (Payments)
- Go to: https://dashboard.razorpay.com/
- Register with business/personal PAN
- Use Test Mode key for hackathon:
  ```
  REACT_APP_RAZORPAY_KEY_ID=rzp_test_...
  ```

### 7. Google Gemini AI (Itinerary Generation)
- Go to: https://ai.google.dev/
- Get API key from Google AI Studio (free)
- Add to .env.local:
  ```
  REACT_APP_GEMINI_API_KEY=...
  ```

---

## 🏗️ Project Structure

```
src/
├── pages/
│   ├── LandingPage.jsx    ← Page 1: Destination discovery
│   ├── PlanPage.jsx       ← Page 2: Trip configurator
│   └── ItineraryPage.jsx  ← Page 3: Hotels + Activities + Booking
├── store/
│   └── tripStore.js       ← Zustand global state
├── lib/
│   └── api.js             ← All API calls + mock fallbacks
├── index.css              ← Premium CSS + fonts + variables
└── App.js                 ← Router + QueryClient + Cursor
```

---

## 🌐 Deployment

### Option 1: Vercel (Recommended — Fastest)

```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
npm run build
vercel --prod

# Add env vars in Vercel dashboard → Settings → Environment Variables
# Add all your REACT_APP_* keys there
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=build

# Add env vars: Netlify Dashboard → Site settings → Environment variables
```

### Option 3: GitHub Pages

```bash
npm install -D gh-pages

# Add to package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d build"
# "homepage": "https://yourusername.github.io/luxetrek"

npm run deploy
```

---

## ⚡ Hackathon Checklist

### Works Without API Keys (Mock Data)
- [x] Landing page with destinations
- [x] Trip configurator (all fields)
- [x] Itinerary page with hotels + activities
- [x] Booking cart with expense splitting

### Add These Keys First (15 min setup)
- [ ] Unsplash — real destination photos
- [ ] OpenWeather — weather widget
- [ ] Gemini — AI itinerary generation

### Add These for Full Demo
- [ ] Amadeus (sandbox) — real hotel prices
- [ ] Razorpay (test mode) — payment flow

---

## 🎨 Design System

- **Display font**: Cormorant Garamond (headings, numbers)
- **Body font**: DM Sans (UI text, buttons)
- **Color palette**: Obsidian (#0A0A0B) + Gold (#C9A84C) + Cream (#F5F0E8)
- **Theme**: Dark luxury, editorial, refined
- **Animations**: CSS keyframes + staggered reveals

---

## 🔐 Security Notes

- Never commit .env.local to git (already in .gitignore)
- All API keys are REACT_APP_ prefixed (visible to browser in React)
- For production: move API calls to a backend (Node/Express)
- Backend should proxy Amadeus, Viator, Razorpay calls
- Use httpOnly cookies for auth tokens (when auth is added)

---

## 👥 Team Assignment

| Page | File | Owner |
|------|------|-------|
| Landing | LandingPage.jsx | Person 1 |
| Configurator | PlanPage.jsx | Person 2 |
| Itinerary | ItineraryPage.jsx | Person 3 |
| Booking | BookingPage.jsx (create) | Person 4 |
| State / APIs | tripStore.js + api.js | Shared |
