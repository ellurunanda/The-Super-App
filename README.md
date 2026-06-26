# The Super App

The Super App is a React and Vite web application that guides users through a complete entertainment flow:

- Register an account
- Log in with registered details
- Select at least 3 entertainment categories
- View a personalized dashboard with widgets
- Browse movies based on selected categories

The app is configured for real API data via a server-side proxy.

## Table of Contents

- Project Overview
- Features
- Tech Stack
- Project Structure
- Prerequisites
- Local Setup
- Environment Variables
- API Proxy Architecture
- Available Scripts
- Deployment (Render)
- Post-Deploy Verification
- User Flow
- Troubleshooting
- Security Notes

## Project Overview

This project is built as a modern frontend single-page application. It uses client-side routing, global persisted state, reusable components, and API service utilities.

The main assignment areas implemented are:

- Registration
- Login
- Category selection
- Dashboard widgets
- Movies discovery and details

## Features

### Authentication and Access Control

- Registration form with validation for name, username, email, and mobile.
- Login form that checks registered username or email and mobile number.
- Route guards for protected pages.
- Conditional redirects:
	- Not registered users go to Register.
	- Not logged in users go to Login.
	- Users with fewer than 3 categories are redirected to Categories.

### Category Selection

- Interactive category cards with visual selection state.
- Minimum 3 categories required before continuing.
- Selected categories shown as chips.

### Dashboard Widgets

- Profile summary widget (user info and selected categories).
- Notes widget with immediate persisted updates.
- Weather widget:
	- City input
	- Geolocation support
	- Current weather metrics
- News widget with rotating headlines.
- Timer widget with start, pause, reset, and manual duration controls.

### Movies Experience

- Genre-based movie rows built from selected categories.
- Card-based movie browsing.
- Movie detail modal with genre, rating, runtime, plot, cast, and poster.

### UX and State

- Toast notifications for success, warning, info, and error states.
- Persistent app state using Zustand persist middleware.

## Tech Stack

- Framework: React 18
- Build Tool: Vite 7
- Routing: react-router-dom 6
- State Management: Zustand 5 (with persistence)
- HTTP Client: Axios
- Icons: lucide-react
- Styling: CSS (global stylesheet with component-level class patterns)

## Project Structure

High-level source structure:

- src/App.jsx: app root layout
- src/main.jsx: React bootstrap
- src/routes/AppRoutes.jsx: route definitions and guards
- src/pages:
	- Register.jsx
	- Login.jsx
	- Categories.jsx
	- Dashboard.jsx
	- Movies.jsx
- src/components:
	- RegistrationForm.jsx
	- CategoryCard.jsx
	- WeatherWidget.jsx
	- NewsWidget.jsx
	- NotesWidget.jsx
	- TimerWidget.jsx
	- MovieCard.jsx
	- MovieModal.jsx
	- Toasts.jsx
- src/services/apiServices.js: API clients and response transforms
- src/store/useStore.js: global state and actions
- src/styles/global.css: shared styles

## Prerequisites

Install the following before setup:

- Node.js 18 or later (Node.js 20 LTS recommended)
- npm 9 or later

To verify:

1. Run: node -v
2. Run: npm -v

## Local Setup

1. Clone the repository.
2. Open the project folder.
3. Install dependencies:

	 npm install

4. Create a local environment file by copying the example:

	 Copy .env.example to .env

5. (Optional) Add your API keys in .env.
6. Start development server:

	 npm run dev

7. Open the local URL shown in terminal (usually http://localhost:5173).

## Environment Variables

Create a local .env file in the project root.

Supported keys:

- OPENWEATHER_API_KEY
- NEWS_API_KEY
- TMDB_API_KEY
- VITE_API_BASE_URL (optional, only if frontend and API proxy are deployed separately)

Use .env.example as the template.

These keys are required for live data.

## API Proxy Architecture

This project uses a server-side API proxy to prevent browser CORS issues and to keep API keys off the client.

- Frontend requests:
	- /api/weather/*
	- /api/news/*
	- /api/tmdb/*
- Server proxy implementation: server.js
- Dev proxy for local development: vite.config.js

How requests flow:

1. Browser calls same-origin /api/* routes.
2. Node/Express server forwards requests to upstream APIs.
3. API keys are appended server-side from environment variables.
4. Response is returned to the browser.

## Available Scripts

- npm run dev: starts Vite development server
- npm run build: creates production build in dist
- npm run preview: serves production build locally
- npm start: runs the Express server that serves dist and proxies API requests

## Deployment (Render)

Deploy this repository as a Render Web Service (Node runtime), not a Static Site.

Required service settings:

- Build Command: npm install && npm run build
- Start Command: npm start

Required environment variables:

- OPENWEATHER_API_KEY
- NEWS_API_KEY
- TMDB_API_KEY

Do not set these in production:

- VITE_OPENWEATHER_API_KEY
- VITE_NEWS_API_KEY
- VITE_TMDB_API_KEY

Optional variable:

- VITE_API_BASE_URL (only when frontend and API proxy are hosted on different domains)

Render blueprint file:

- render.yaml

## Post-Deploy Verification

After deploy completes, verify:

1. Dashboard weather widget shows live data.
2. News widget rotates headlines.
3. Movies page loads rows for selected categories.
4. Browser Network tab shows requests to same-origin /api/* routes.

If something fails, check Render logs for:

- missingServerKey
- Upstream API errors such as 401, 403, or 429

## MissingServerKey Quick Fix

If API responses show:

- code: missingServerKey

Do this exactly:

1. Open Render service settings.
2. Confirm service type is Web Service.
3. Add or verify environment variables:
	- OPENWEATHER_API_KEY
	- NEWS_API_KEY
	- TMDB_API_KEY
4. Remove old VITE_ key variables if present.
5. Save changes and trigger a full redeploy.

Important:

- Local .env changes do not update Render.
- Render only reads variables saved in Render dashboard (or render.yaml env blocks, if configured).

## User Flow

1. Register on the first screen.
2. Log in with registered username or email plus mobile number.
3. Select at least 3 categories.
4. Continue to Dashboard.
5. Review widgets and manage notes/timer/weather.
6. Navigate to Movies for personalized movie rows and details.

## Troubleshooting

### Dependency or startup issues

- Delete node_modules and reinstall:
	- Remove node_modules folder
	- Run npm install

### Port already in use

- Start Vite on another port:
	- npm run dev -- --port 5174

### Live API data not showing

- Check that .env exists in project root.
- Check variable names exactly match OPENWEATHER_API_KEY, NEWS_API_KEY, and TMDB_API_KEY.
- Restart dev server after changing .env.
- In production, confirm Render has all 3 server environment variables.
- Ensure deployment target is Web Service, not Static Site.
- Ensure Render redeploy happened after env variable changes.

### Push blocked due to secrets

- Never commit .env.
- Keep real keys only in local .env.
- Use .env.example for shared templates.

## Security Notes

- API keys are consumed by the server proxy and are not sent to browser code.
- Keep keys only in server environment variables.
- Do not set VITE_ API key variables in production builds.
- Rotate keys immediately if they are accidentally committed.
