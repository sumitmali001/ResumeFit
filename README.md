# ResumeFit - Modern MERN Stack AI Resume Analyzer

ResumeFit is a production-ready, modern MERN Stack application that evaluates candidate resumes against target job profiles using artificial intelligence (Llama 3.1 LLM prompt engineering) and dynamic technical assessments.

---

## 📁 Project Architecture & Folder Structure

```
ResumeFit/
├── client/                     # Frontend Application (React 19 + Vite)
│   ├── public/                 # Static assets & favicons
│   │   └── WebsiteLogo.png
│   ├── src/
│   │   ├── assets/             # Branding & visual assets
│   │   ├── components/         # Reusable UI components (Navbar, Footer, ScoreCircle, SkillTag, etc.)
│   │   ├── contexts/           # React Context (AnalysisContext, ThemeContext)
│   │   ├── layouts/            # MainLayout wrapper
│   │   ├── pages/              # Views (HomePage, AnalyzerPage, QuizPage, AnalysisPage, HistoryPage, HelpPage, AboutPage)
│   │   ├── services/           # Axios API client module
│   │   ├── styles/             # Global styles
│   │   ├── utils/              # Formatters & helpers
│   │   ├── App.jsx             # React Router 7 setup with Sonner Toaster
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Tailwind CSS v4 directives & glassmorphism theme
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend API Service (Node.js + Express + MongoDB)
│   ├── config/                 # Database configuration (db.js)
│   ├── controllers/            # Request handlers (analyzerController.js)
│   ├── middleware/             # Upload, validation, auth, and error handling middleware
│   ├── models/                 # Mongoose schemas (Analysis.js, User.js)
│   ├── routes/                 # Express API routes (analyzerRoutes.js)
│   ├── services/               # AI & PDF services (aiService.js, pdfService.js)
│   ├── utils/                  # Skills extraction regex helpers
│   ├── uploads/                # Local uploads buffer storage
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── README.md
└── package.json
```

---

## ⚡ Quick Start & Installation Commands

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017/resumefit`) or MongoDB Atlas URI

### 2. Backend Setup
```bash
cd server
npm install
```

Configure your `server/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resumefit
JWT_SECRET=resumefit_super_secret_jwt_key_2026
HF_API_KEY=your_huggingface_api_key_here
AI_MODEL=meta-llama/Llama-3.1-8B-Instruct:novita
```

Start the backend server:
```bash
npm run dev
# Server will start on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd client
npm install
```

Start the Vite development server:
```bash
npm run dev
# Client will start on http://localhost:3000
```

---

## 📦 Dependencies Breakdown

### Frontend (`client/package.json`)
- **React 19 & React DOM**: UI rendering engine
- **Vite**: Ultra-fast build tool and development server
- **React Router DOM**: Client-side single page routing
- **Axios**: Asynchronous HTTP client
- **Tailwind CSS**: Utility-first CSS styling framework
- **Lucide React**: Modern iconography library
- **Framer Motion**: Smooth component transition animations
- **Sonner**: Toast notifications
- **React Hook Form**: Performant form validation

### Backend (`server/package.json`)
- **Express**: Node.js web application framework
- **Mongoose**: Object modeling for MongoDB database persistence
- **Multer**: Multipart/form-data handler for PDF file uploads
- **pdf-parse**: PDF text extraction library
- **Helmet**: HTTP header security middleware
- **CORS**: Cross-origin resource sharing configuration
- **Morgan**: HTTP request logger
- **Express Validator**: Input validation and sanitization
- **jsonwebtoken & bcryptjs**: JWT authentication and password hashing
- **dotenv**: Environment variable manager

---

## 🍃 MongoDB Setup

1. Install MongoDB locally or create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database named `resumefit`.
3. Provide your connection string in `server/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/resumefit
   ```
4. The system automatically creates collections for `analyses` and `users`.

---

## 🚀 Deployment Recommendations

- **Frontend (Client)**: Deploy to Vercel, Netlify, or Cloudflare Pages with build command `npm run build` and output folder `dist`.
- **Backend (Server)**: Deploy to Render, Railway, AWS EC2, or DigitalOcean App Platform. Set node start command to `node server.js` and configure environment variables in server settings.

---

## 🔑 Required Environment Variables

### Client (`client/.env`)
```env
VITE_API_URL=/api
```

### Server (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resumefit
JWT_SECRET=resumefit_super_secret_jwt_key_2026
HF_API_KEY=your_huggingface_api_key_here
AI_MODEL=meta-llama/Llama-3.1-8B-Instruct:novita
```
