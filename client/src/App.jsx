import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AnalysisProvider } from "./contexts/AnalysisContext";
import { Toaster } from "sonner";

import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import AnalyzerPage from "./pages/AnalyzerPage";
import QuizPage from "./pages/QuizPage";
import AnalysisPage from "./pages/AnalysisPage";
import HistoryPage from "./pages/HistoryPage";
import HelpPage from "./pages/HelpPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <ThemeProvider>
      <AnalysisProvider>
        <Toaster position="top-right" richColors theme="dark" />
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="analyzer" element={<AnalyzerPage />} />
              <Route path="quiz" element={<QuizPage />} />
              <Route path="analysis" element={<AnalysisPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="help" element={<HelpPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </AnalysisProvider>
    </ThemeProvider>
  );
}
