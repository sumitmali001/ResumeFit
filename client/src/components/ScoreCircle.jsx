import React from "react";
import { motion } from "framer-motion";

export default function ScoreCircle({ score = 0, size = 180, strokeWidth = 14 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let color = "#0077B6";
  if (normalizedScore < 50) color = "#ef4444";
  else if (normalizedScore < 70) color = "#f59e0b";
  else if (normalizedScore >= 85) color = "#10b981";

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="score-circle-track"
        />
        {/* Progress indicator */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>

      {/* Inner score badge */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-baseline"
        >
          <span className="text-4xl font-extrabold tracking-tight text-white score-circle-text">
            {normalizedScore}
          </span>
          <span className="text-xl font-bold text-[#0077B6]">%</span>
        </motion.div>
        <span className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Match Score
        </span>
      </div>
    </div>
  );
}
