# SmartHire AI

SmartHire AI is a Django 5 backend project for a 48-hour hackathon, utilizing Django REST Framework (DRF) and PostgreSQL.

## Getting Started

1. Navigate to the backend directory:
```bash
cd smarthire/backend
```

2. Create and activate a run environment (e.g., using venv):
```bash
python -m venv venv
source venv/Scripts/activate  # on Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file based on `.env.example` and fill in your variables like `GEMINI_API_KEY`.

5. Run database migrations:
```bash
python manage.py migrate
```

6. Start the development server:
```bash
python manage.py runserver
```
