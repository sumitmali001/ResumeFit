import { body, validationResult } from "express-validator";

export const validateResumeExtract = [
  // file validated by multer
];

export const validateJobRole = [
  body("jobRole")
    .trim()
    .notEmpty()
    .withMessage("Target job role is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Job role must be between 2 and 100 characters"),
  handleValidationErrors,
];

export const validateCompatibility = [
  body("resumeSkills").optional().isString(),
  body("requiredSkills").optional().isString(),
  handleValidationErrors,
];

export const validateSaveAnalysis = [
  body("jobRole").trim().notEmpty().withMessage("Job role is required"),
  body("score").isNumeric().withMessage("Score must be a number"),
  body("compatibility").notEmpty().withMessage("Compatibility is required"),
  handleValidationErrors,
];

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array().map((e) => e.msg),
    });
  }
  next();
}
