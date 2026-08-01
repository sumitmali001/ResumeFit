# ResumeFit - Project Report

## 1. User Flow
ResumeFit provides a seamless, step-by-step experience for job seekers to evaluate their resumes against target job profiles using AI:

1. **Onboarding:** The user lands on the Home page, which introduces the application's capabilities. Clicking "Get Started" navigates them directly to the Analyzer page.
2. **Document Upload:** The user uploads their resume (restricted to PDF format). The system instantly parses the text content from the PDF in the background.
3. **Role Specification:** The user enters the target job role (e.g., "Frontend Developer").
4. **Analysis Selection:** The user has two paths:
   - **Normal "Analyze":** The system securely evaluates the resume against standard market requirements for the target role. It identifies the candidate's existing skills, lists necessary skills for the job, and computes an AI-derived compatibility score, complete with missing skills and improvement suggestions. The UI immediately displays a dashboard with interactive score charts and tags.
   - **"Advanced Analyze":** While normal analysis runs in the background, a customized 25-question multiple-choice technical quiz is generated based on the target job role. The user takes the quiz to demonstrate their practical knowledge. Upon submission, the system combines the quiz score with the AI compatibility score (on a 50/50 weighted basis) to produce a highly accurate, holistic final compatibility score.
5. **Insights & Navigation:** Users can review detected vs. missing skills to adapt their actual resume document. Furthermore, the intuitive navigation bar provides access to "Help", "About", and a light/dark mode theme toggle.

---

## 2. How the Platform Accomplishes its Tasks
The magic of ResumeFit comes from a decoupled, multi-runtime architecture utilizing both Python and Node.js combined with external AI:

- **PDF Parsing:** When a user uploads a PDF, the vanilla JavaScript frontend sends the file as form data to a dedicated Python backend route (`/api/extract`). This route uses `pdfplumber` to accurately read and extract raw text from modern resumes.
- **AI Processing pipeline:** The plaintext resume and target job role are forwarded to the Node.js backend. The Node logic utilizes system-engineered prompts and passes them via HTTP calls to the Hugging Face Inference API. It uses the `meta-llama/Llama-3.1-8B-Instruct:novita` model to identify specific technical skills, generate the standard required skills for the given role, calculate matching heuristics, and intelligently construct domain-relevant multiple-choice quizzes on the fly.
- **Dynamic Frontend State:** The vanilla JS frontend orchestrates view transitions through CSS class manipulating (adding/removing `active`), providing a SPA (Single Page Application) feel without the overhead of heavy frameworks. The client asynchronously handles API loading states to provide a non-blocking, smooth user experience.

---

## 3. Tech Stack Used

### Frontend
- **HTML5:** Semantic architecture and structure of the application.
- **CSS3:** Custom styles, modern flex/grid layouts, responsive mobile-first media queries, glowing aesthetic components, and theme variable management (Dark/Light mode).
- **Vanilla JavaScript (ES6+):** Pure DOM manipulation, asynchronous fetching (Fetch API), file handling, state management, and custom pie chart visualizations logic.

### Backend & Middleware
- **Node.js:** Core runtime for API communication and JSON handling.
- **Express.js:** Lightweight routing framework for Node backend endpoints.
- **Python:** Dedicated extraction runtime parsing PDFs structure efficiently.
- **Flask & Flask-CORS:** Lightweight Python web server for exposing the PDF extraction component.

### Third-party Services & Packages
- **Hugging Face Serverless API:** Providing the Llama 3.1 LLM for intelligent text and data analysis.
- **pdfplumber:** Robust library for extracting text, shapes, and figures from PDFs.
- **node-fetch, dotenv, cors, multer:** Standard JS libraries handling requests, environment variables, security policies, and file uploads.
- **Vercel Serverless Functions:** Multi-runtime deployment configuration to serve Python functions and Node functions synchronously.

---

## 4. File-by-File Detailed Explanation

### Frontend (`/public`)
- **`public/index.html`**: The single HTML page holding all sections. Uses `<section>` elements as views ("Home", "Upload", "Analysis", "Quiz", "Help", "About"). It defines the navigation bar, hamburger menus, and includes the layout for the compatibility dashboard.
- **`public/style.css`**: Contains all visual behaviors including animations, glassmorphism card styling, responsive breakpoints, variable-based theme switching, floating background elements logic, and the precise design geometry for the circular score gauge.
- **`public/script.js`**: The controller for everything front-facing. It handles local storage (for dark/light mode preference), DOM event listeners for buttons and form uploads, and builds FormData. It holds custom functions (`runNormalAnalysis`, `renderQuiz`, `updateUI`) to control the lifecycle from fetching AI data to rendering the final customized compatibility UI gracefully.

### Node.js Backend (`/server` & `/api`)
- **`server/server.js`**: An Express server handling application endpoints (`/api/analyze`, `/api/analyze-job-role`, `/api/analyze-compatibility`, `/api/generate-questions`). It captures POST payloads and forwards the inner data to the helper functions inside `ai.js`, catching and returning explicit JSON errors if something fails.
- **`server/ai.js`**: The central logic core for interacting with Hugging Face. Contains the function `chatWithAI` handling standard API handshakes. Features highly specific prompt-engineering functions:
  - `extractSkillsFromResume`: Uses Regex to trim the resume body and isolate the "Skills" section, then uses the LLM to format the skills into a comma-separated list accurately.
  - `extractSkillsFromJobRole`: Asks the LLM to act as a recruiter and fetch 8-12 core technical skills for a specific role.
  - `analyzeCompatibility`: Instructs the LLM to behave like an ATS to compute match percentage, determine missing skills, and formulate advice.
  - `generateQuestions`: Automates the generation of a JSON-structured technical assessment.
- **`api/index.js`**: A minimal wrapper entry point required by Vercel to correctly identify and launch the Node.js Express server inside a serverless lambda function.

### Python Backend (`/api`)
- **`api/extract.py`**: A specialized Flask endpoint (`/` mapped to `/api/extract` via Vercel). It accepts a multipart-form file upload ("file" part), validates it’s a PDF, opens the file using `pdfplumber`, iterates over its pages securely, extracts the internal text, and returns the aggregated text string. 

### Configuration Files
- **`package.json` / `package-lock.json`**: NPM configurations managing Node scripts, module type specification (`"type": "module"`), and installed Javascript dependencies (`express`, `node-fetch`, etc.).
- **`requirements.txt`**: Tells the Python environment (specifically Vercel's Python builder) about the necessary Python packages to compile (`flask`, `pdfplumber`, `flask-cors`).
- **`vercel.json`**: The orchestrator file for the platform infrastructure. It defines routing rewrites that funnel `/api/extract` direct traffic to the Python execution environment while routing other `/api/(.*)` requests to the Node.js executable, and neatly mapping base requests directly to `/public/index.html`.
