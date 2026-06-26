# The Super App

The Super App is a React and Vite web application that guides users through a complete entertainment flow:

- Register an account
- Log in with registered details
- Select at least 3 entertainment categories
- View a personalized dashboard with widgets
- Browse movies based on selected categories

The app is designed to work even without external API keys by using fallback data.

## Table of Contents

- Project Overview
- Features
- Tech Stack
- Project Structure
- Prerequisites
- Local Setup
- Environment Variables
- Available Scripts
- User Flow
- Fallback Data Behavior
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
- Fallback content so core UI stays functional without API keys.

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
- src/services/apiServices.js: API clients, transforms, and fallback data
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

- VITE_OPENWEATHER_API_KEY
- VITE_NEWS_API_KEY
- VITE_TMDB_API_KEY

Use .env.example as the template.

If these are not provided, the app uses built-in fallback data for weather, news, and movies.

## Available Scripts

- npm run dev: starts Vite development server
- npm run build: creates production build in dist
- npm run preview: serves production build locally

## User Flow

1. Register on the first screen.
2. Log in with registered username or email plus mobile number.
3. Select at least 3 categories.
4. Continue to Dashboard.
5. Review widgets and manage notes/timer/weather.
6. Navigate to Movies for personalized movie rows and details.

## Fallback Data Behavior

The app intentionally remains usable when API keys are missing.

- Weather falls back to static weather data.
- News falls back to static headlines.
- Movies falls back to a curated movie set.

This allows local development and demo usage without external service setup.

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
- Check variable names exactly match expected VITE_ names.
- Restart dev server after changing .env.

### Push blocked due to secrets

- Never commit .env.
- Keep real keys only in local .env.
- Use .env.example for shared templates.

## Security Notes

- This is a frontend app, so any VITE_ key is exposed in browser runtime.
- Use restricted or development-only keys where possible.
- Rotate keys immediately if they are accidentally committed.
