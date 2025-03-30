[https://thetimecapsule.onrender.com](https://thetimecapsule.onrender.com)

⏳ **The Time Capsule**

*A retro-inspired e-commerce app built with Flask and React (Vite), bringing back the best of the '80s, '90s, and 2000s through curated nostalgic items.*

---

## 🚀 Tech Stack

- **Backend**: Flask, SQLAlchemy, PostgreSQL  
- **Frontend**: React (Vite), Redux  
- **Deployment**: Docker + Render

---

## 🛠️ Getting Started (Development)

1. **Clone the repo**

   ```bash
   git clone https://github.com/JenW79/thetimecapsule.git
   cd thetimecapsule
   ```

2. **Install backend dependencies**

   ```bash
   pipenv install -r requirements.txt
   ```

3. **Create a `.env` file**  
   Include keys like:

   ```env
   SECRET_KEY=your_secret_key
   DATABASE_URL=sqlite:///dev.db
   FLASK_APP=app
   FLASK_DEBUG=true
   SCHEMA=your_schema_name
   ```

4. **Set up your database**

   ```bash
   pipenv shell
   flask db upgrade
   flask seed all
   flask run
   ```

5. **Install frontend dependencies**

   ```bash
   cd react-vite
   npm install
   npm run build
   ```

---

## 🌍 Deployment (Render)

- Make sure the `dist/` folder exists in `react-vite`
- Push your changes to the `main` branch
- Configure your Render Web Service and Postgres DB with environment variables:
  - `SECRET_KEY`
  - `FLASK_APP=app`
  - `FLASK_ENV=production`
  - `DATABASE_URL`
  - `SCHEMA=your_schema_name`

---

## 🧭 Coming Soon

- 📊 Database schema map  
- 🔌 API endpoints documentation  
- 🎨 Frontend screenshots and style guide  
- ✅ Feature roadmap

---

## 👩‍💻 Team
 
- Kathryn M.
- Andrea F.
- Jen W. 

---

> Built with love and collaboration during App Academy’s group project phase.



