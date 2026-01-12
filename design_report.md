# Project Design & Structure Report

## 1. Executive Summary
The project is a Web Application featuring a React-based frontend and a lightweight Node.js backend (likely deployed as Serverless Functions). It serves as an AI Chatbot Station ("Doctus Grid") with multiple personas (Professor Pulsar, GiggleBit, etc.) and capabilities like voice input/output, secure chat persistence, and AI image generation.

## 2. Architecture Overview
- **Pattern**: Client-Server (SPA + API Proxy).
- **Frontend**: Single Page Application (SPA) built with React and Vite.
- **Backend**: Serverless functions proxying requests to external AI services (Pollinations.ai).
- **Deployment**: Configured for Vercel (implied by `vercel.json` and `api` directory structure).

## 3. Component Details

### 3.1 Frontend (`src/`)
- **Framework**: React 19, Vite.
- **Styling**: Tailwind CSS (inferred from utility classes) + Custom CSS (`App.css`, `index.css`).
- **State Management**: React Context (`AuthContext`) and Custom Hooks.
- **Key Components**:
  - `AIChatbotStation` (`App.jsx`): Main orchestration controller.
  - `Sidebar`, `ChatInput`, `MessageList`: UI structural components.
  - `Onboarding`: User entry flow.
- **Integrations**:
  - **Appwrite**: For authentication and backend-as-a-service features.
  - **Pollinations.ai**: Used for Text Generation and Image Generation (Flux model).
  - **Web Speech API**: Used for Voice Input/Output.

### 3.2 Backend (`/api`)
- **Runtime**: Node.js (Serverless).
- **Functionality**:
  - `chat.js`: Acts as a secure proxy to `text.pollinations.ai`. It handles CORS, method validation (POST only), and error handling.
- **Data**:
  - Several `models*.json` files exist in the root, potentially for defining AI model parameters or fallback data, though currently appear unused in the active code paths.

## 4. Observations & Recommendations
- **Security**: The backend explicitly handles CORS and preflight checks, which is good.
- **Code Organization**: The project is currently flat. Restructuring into `frontend` and `backend` will improve maintainability and deployment workflows.
- **Unused Files**: `check_models.js` is empty and `models*.json` usage is unclear. These will be moved to the backend archive/data folder for now.

## 5. Design System & Styling
The application uses a "Cosmic/Aurora" theme with heavy usage of glassmorphism (translucency + blur) and neon accents.

### 5.1 Color Palette (CSS Variables)
Most colors are defined in `:root` inside `src/index.css`.
- **Primary Background**: `#000000` (Pitch Black)
- **Accents**:
  - Blue: `#0A84FF` (System Blue)
  - Cyan: `#00D9FF` (SciBot)
  - Fuchsia: `#FF006E` (JokeBot)
  - Emerald: `#10B981` (Helper)
  - Violet: `#8B5CF6` (Explorer)
- **Glass Surfaces**:
  - Regular: `rgba(15, 23, 42, 0.15)`
  - Sidebar: `rgba(10, 15, 25, 0.12)`

### 5.2 Key Visual Effects

#### Aurora Background Animation
A 400% size gradient background that shifts continuously.
```css
.aurora-background {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(circle at 15% 40%, rgba(0, 217, 255, 0.12) 0%, transparent 50%),
    radial-gradient(circle at 85% 75%, rgba(255, 0, 110, 0.12) 0%, transparent 50%),
    radial-gradient(circle at 50% 25%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
  background-size: 400% 400%;
  animation: auroraShift 12s ease-in-out infinite;
}
```

#### Glass Panel
The core card style used throughout.
```css
.glass-panel {
  background: var(--glass-regular);
  backdrop-filter: blur(50px) saturate(190%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
}
```

### 5.3 Typography
- **Font Family**: 'Inter', sans-serif (Google Fonts).
- **Weights**: 300 to 800.
