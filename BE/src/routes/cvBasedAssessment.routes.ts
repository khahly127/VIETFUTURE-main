import express from "express";
import {
  getQuestionsBasedOnCV,
  submitAndEvaluate
} from "../controllers/cvBasedAssessment.controller";

const router = express.Router();

// Get questions based on CV
router.post("/questions", getQuestionsBasedOnCV);

// Submit answers and get evaluation
router.post("/evaluate", submitAndEvaluate);

export default router;
