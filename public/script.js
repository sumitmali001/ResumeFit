document.addEventListener("DOMContentLoaded", () => {

    const themeToggleBtn = document.getElementById("themeToggleBtn");
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-theme");
        themeToggleBtn.innerHTML = "🌙";
    } else {
        themeToggleBtn.innerHTML = "☀️";
    }

    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        if (document.body.classList.contains("light-theme")) {
            localStorage.setItem("theme", "light");
            themeToggleBtn.innerHTML = "🌙";
        } else {
            localStorage.setItem("theme", "dark");
            themeToggleBtn.innerHTML = "☀️";
        }
    });

    const pages = {
        home: document.getElementById("landingPage"),
        upload: document.getElementById("uploadPage"),
        analysis: document.getElementById("analysisPage"),
        help: document.getElementById("helpPage"),
        about: document.getElementById("aboutPage"),
        quiz: document.getElementById("quizPage")
    };

    function showPage(page) {
        // Fade out active pages
        const activePages = Object.values(pages).filter(p => p.classList.contains("active"));

        activePages.forEach(p => {
            p.classList.remove("active");
            p.classList.add("fade-out");
        });

        setTimeout(() => {
            activePages.forEach(p => {
                p.classList.remove("fade-out");
                p.style.display = "none";
            });

            // Prepare new page
            page.style.display = page.id === "analysisPage" ? "flex" : "block";

            // Trigger reflow to apply display before opacity change
            void page.offsetWidth;

            page.classList.add("active");
            page.classList.add("fade-in");

            setTimeout(() => {
                page.classList.remove("fade-in");
            }, 400); // match transition time
        }, 300); // wait for fade out
    }

    /* NAVIGATION */

    document.getElementById("homeLink").onclick = () => showPage(pages.home);
    document.getElementById("analyzerLink").onclick = () => showPage(pages.upload);
    document.getElementById("helpLink").onclick = () => showPage(pages.help);
    document.getElementById("aboutLink").onclick = () => showPage(pages.about);
    document.getElementById("startBtn").onclick = () => showPage(pages.upload);
    document.getElementById("navStartBtn").onclick = () => showPage(pages.upload);

    /* BACKEND LOGIC */

    const uploadBtn = document.getElementById("uploadBtn");
    const resumeInput = document.getElementById("resumeInput");
    const fileName = document.getElementById("fileName");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const advancedAnalyzeBtn = document.getElementById("advancedAnalyzeBtn");
    const jobRoleInput = document.getElementById("jobRoleInput");

    let resumeSkillsText = "";
    let requiredSkillsText = "";

    // Quiz State
    let quizData = [];
    let isAdvancedMode = false;
    let normalAnalysisResult = null;

    uploadBtn.addEventListener("click", () => {
        resumeInput.click();
    });

    resumeInput.addEventListener("change", async () => {

        if (!resumeInput.files.length) return;

        const file = resumeInput.files[0];

        if (file.type !== "application/pdf") {
            alert("Only PDF allowed");
            return;
        }

        fileName.textContent = file.name;

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/extract", {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        const resumeText = data.text;

        const skillRes = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resumeText })
        });

        const skillData = await skillRes.json();
        resumeSkillsText = skillData.skills;

    });

    async function runNormalAnalysis() {
        const jobRole = jobRoleInput.value.trim();

        const roleRes = await fetch("/api/analyze-job-role", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobRole })
        });

        const roleData = await roleRes.json();
        requiredSkillsText = roleData.requiredSkills;

        const compRes = await fetch("/api/analyze-compatibility", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                resumeSkills: resumeSkillsText,
                requiredSkills: requiredSkillsText
            })
        });

        return await compRes.json();
    }

    analyzeBtn.addEventListener("click", async () => {
        if (!resumeSkillsText) {
            alert("Upload resume first");
            return;
        }

        const jobRole = jobRoleInput.value.trim();
        if (!jobRole) {
            alert("Enter job role");
            return;
        }

        analyzeBtn.textContent = "Analyzing...";
        analyzeBtn.disabled = true;

        const result = await runNormalAnalysis();
        updateUI(result);
        showPage(pages.analysis);

        analyzeBtn.textContent = "Analyze";
        analyzeBtn.disabled = false;
    });

    advancedAnalyzeBtn.addEventListener("click", async () => {
        if (!resumeSkillsText) {
            alert("Upload resume first");
            return;
        }

        const jobRole = jobRoleInput.value.trim();
        if (!jobRole) {
            alert("Enter job role");
            return;
        }

        isAdvancedMode = true;
        advancedAnalyzeBtn.textContent = "Loading...";
        advancedAnalyzeBtn.disabled = true;

        showPage(pages.quiz);
        document.getElementById("loadingQuiz").style.display = "block";
        document.getElementById("quizQuestionsContainer").innerHTML = "";
        document.getElementById("submitQuizContainer").style.display = "none";
        document.getElementById("quizScoreDisplay").style.display = "none";

        // run normal analysis in background
        runNormalAnalysis().then(res => {
            normalAnalysisResult = res;
        }).catch(err => console.error("Normal analysis failed:", err));

        try {
            const quizRes = await fetch("/api/generate-questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobRole })
            });
            const data = await quizRes.json();
            if (data.questions && data.questions.length > 0) {
                quizData = data.questions;
                renderQuiz(quizData);
            } else {
                alert("Failed to generate questions. Please try again.");
                showPage(pages.upload);
            }
        } catch (error) {
            console.error(error);
            alert("Error generating questions.");
            showPage(pages.upload);
        }

        document.getElementById("loadingQuiz").style.display = "none";
        advancedAnalyzeBtn.textContent = "Advanced Analyze";
        advancedAnalyzeBtn.disabled = false;
    });

    function renderQuiz(questions) {
        const container = document.getElementById("quizQuestionsContainer");
        container.innerHTML = "";

        questions.forEach((q, index) => {
            const card = document.createElement("div");
            card.className = "quiz-question-card";

            const qText = document.createElement("div");
            qText.className = "quiz-question-text";
            qText.textContent = `${index + 1}. ${q.question}`;
            card.appendChild(qText);

            const optionsContainer = document.createElement("div");
            optionsContainer.className = "quiz-options";

            q.options.forEach((opt, optIndex) => {
                const label = document.createElement("label");
                label.className = "quiz-option-label";

                const input = document.createElement("input");
                input.type = "radio";
                input.name = `question-${index}`;
                input.value = opt;
                input.className = "quiz-option-input";

                label.appendChild(input);
                label.appendChild(document.createTextNode(opt));
                optionsContainer.appendChild(label);
            });

            card.appendChild(optionsContainer);
            container.appendChild(card);
        });

        document.getElementById("submitQuizContainer").style.display = "block";
    }

    document.getElementById("submitQuizBtn").addEventListener("click", () => {
        let score = 0;

        quizData.forEach((q, index) => {
            const selected = document.querySelector(`input[name="question-${index}"]:checked`);
            if (selected && selected.value === q.answer) {
                score++;
            }
        });

        const quizPercentage = Math.round((score / quizData.length) * 100);

        if (!normalAnalysisResult) {
            alert("Analysis is still running in the background. Please try submitting again in a few seconds.");
            return;
        }

        // Calculate final score = 50% normal score + 50% quiz score
        const normalScore = normalAnalysisResult.score;
        const finalScore = Math.round((normalScore * 0.5) + (quizPercentage * 0.5));

        // Setup new result object
        const finalResult = {
            ...normalAnalysisResult,
            score: finalScore,
            compatibility: `Final Score: ${finalScore}% (AI Analysis: ${normalScore}% | Quiz: ${quizPercentage}%)`
        };

        updateUI(finalResult);
        showPage(pages.analysis);

        // Reset state
        isAdvancedMode = false;
        normalAnalysisResult = null;
    });

    function updateUI(result) {

        const score = result.score;
        const color = score < 50 ? "#ef4444" : score < 70 ? "#f59e0b" : "#3b82f6";

        document.querySelector(".score-circle").style.background =
            `conic-gradient(${color} ${score * 3.6}deg, #1e293b 0deg)`;

        // Keep the <span> styling inside the score circle intact
        document.getElementById("scoreText").innerHTML = `${score}<span>%</span>`;
        document.getElementById("barFill").style.width = score + "%";
        document.getElementById("barFill").style.background = color;
        document.getElementById("compatibilityLabel").textContent = result.compatibility;
        document.getElementById("suggestionText").textContent = result.suggestion;

        renderSkills("detectedSkills", resumeSkillsText);
        renderSkills("requiredSkills", requiredSkillsText);

        const missingContainer = document.getElementById("missingSkills");
        missingContainer.innerHTML = "";

        result.missingSkills.forEach(skill => {
            const span = document.createElement("span");
            span.textContent = skill;
            missingContainer.appendChild(span);
        });

    }

    function renderSkills(id, text) {
        const container = document.getElementById(id);
        container.innerHTML = "";
        text.split(",").forEach(skill => {
            const span = document.createElement("span");
            span.textContent = skill.trim();
            container.appendChild(span);
        });
    }

});