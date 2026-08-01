import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    resumeFileName: {
      type: String,
      default: "Resume.pdf",
    },
    jobRole: {
      type: String,
      required: true,
      trim: true,
    },
    resumeSkills: {
      type: [String],
      default: [],
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    aiScore: {
      type: Number,
      default: 0,
    },
    quizScore: {
      type: Number,
      default: null,
    },
    compatibility: {
      type: String,
      required: true,
    },
    suggestion: {
      type: String,
      default: "",
    },
    isAdvanced: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Analysis = mongoose.model("Analysis", analysisSchema);
