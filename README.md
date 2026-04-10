# DevLens 🔍

An AI-powered code review tool that gives real-time streaming feedback on your code.

## Live Demo
https://devlens-five.vercel.app/

## Features
- 🔐 JWT Authentication with HTTP-only cookies
- ⚡ Real-time AI feedback via Server-Sent Events (SSE)
- 💾 Review history saved per user
- 🗑️ Delete saved reviews
- 📱 Fully responsive UI

## Tech Stack

**Frontend:**
- React.js + Vite
- Tailwind CSS + DaisyUI
- Axios

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- Groq API (LLaMA 3.3 70B)
- JWT + HTTP-only cookies
- Server-Sent Events for streaming

## How It Works
1. Register/Login to your account
2. Paste any code snippet and select the language
3. Click **Review My Code**
4. AI streams feedback in real time covering:
   - Summary of what the code does
   - Bugs and issues
   - Improvement suggestions
   - Security concerns
   - Overall score out of 10

## Local Setup

**Clone the repo:**
```bash
git clone https://github.com/AdeibArief/devlens.git
cd devlens
```

**Backend:**
```bash
cd server
npm install
```

Create `server/.env`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
NODE_ENV=development
PORT=5001
```

```bash
npm run dev
```

**Frontend:**
```bash
cd client
npm install
```

Create `client/.env`:
```
VITE_API_URL=http://localhost:5001
```

```bash
npm run dev
```

Open `http://localhost:5173`

## Key Technical Decisions

- **Groq over OpenAI** — Groq's free tier works in India where Gemini has restrictions
- **SSE over WebSockets** — Server-Sent Events are simpler and sufficient for one-way streaming
- **HTTP-only cookies over localStorage** — More secure, not accessible via JavaScript
- **`sameSite: none` in production** — Required for cross-domain cookie sharing between Vercel and Render

## Screenshots
<img width="1652" height="838" alt="image" src="https://github.com/user-attachments/assets/2542ed1b-0e00-42e1-a9ca-018fbc6915e4" />


## Author
**Shaik Mohd Adeib Arief**
- GitHub: [@AdeibArief](https://github.com/AdeibArief)
