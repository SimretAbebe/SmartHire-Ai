# 🇪🇹 SmartHire AI - Secure Domestic Labor Marketplace 🚀

SmartHire AI is a full-stack, AI-driven platform designed to revolutionize the domestic worker industry in Ethiopia. We bridge the trust gap between employers and domestic workers using **National Digital ID (Fayda)** and **Gemini 2.0 Flash AI**.

---

## 🔥 Key Innovation: The SmartHire Ecosystem

-   🤖 **Gemini 2.0 Flash Matching**: Intelligent matching based on skills, location, and personality traits.
-   🇪🇹 **Bilingual Smart Contracts**: Instant AI-generated labor agreements in both **Amharic and English** to ensure full legal clarity.
-   🆔 **Fayda ID Integration**: Native cryptographic verification of National IDs to ensure 100% verified workers.
-   💬 **AI Helper Assistant**: Real-time help for employers to draft job descriptions and understand labor laws.

---

## 🛠️ Technology Stack

| Part | Tech |
| :--- | :--- |
| **Backend** | Django 5 + DRF (stateless API) |
| **Frontend** | React 18 + Vite (High-performance UI) |
| **AI Engine** | Google Gemini 2.0 Flash |
| **Database** | PostgreSQL / SQLite3 |
| **Styling** | Vanilla CSS + Tailwind + Framer Motion |

---

## 🚀 Speed-Run Demo Guide


1.  **Start Backend**: `cd backend && python manage.py runserver`
2.  **Start Frontend**: `cd frontend && npm run dev`
3.  **Go to Browser**: `http://localhost:5173`
4.  **Flow**:
    -   Click **Hire Helper** -> Step 1 (Register)
    -   Step 3 (Identity Check) -> **Fayda ID verification** animation.
    -   Step 4 (The Magic) -> Click **Find Matches** to see the AI agent scan.
    -   Click **Hire/Contact** -> See Gemini draft a **Bilingual Contract** in real-time.

---

## 🛡️ Reliability Features

If the main AI API hits a quota limit (HTTP 429), our **`SmartAIRotator`** engine:
1.  Silently switches to the next available API key from `.env`.
2.  Fails-over to an external AI service if all keys are exhausted.
3.  Ensures your demo **never** shows a crash screen to the judges.

---




