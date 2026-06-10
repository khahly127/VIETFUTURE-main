import { Request, Response } from "express";
import {
  getAssessmentForRole,
  createCVBasedAssessment,
  analyzeAssessmentResults
} from "../services/cvBasedAssessment.service";

// Endpoint 1: Lấy assessment dựa trên CV
export const getQuestionsBasedOnCV = async (req: Request, res: Response) => {
  try {
    const { cvContent, user_id, roadmap_id } = req.body;

    if (!cvContent || !user_id || !roadmap_id) {
      return res.status(400).json({
        message: "cvContent, user_id, and roadmap_id are required"
      });
    }

    // Tạo CV-based assessment
    const assessmentSetup = await createCVBasedAssessment(user_id, cvContent, roadmap_id);

    return res.status(200).json({
      message: "CV-based assessment created successfully",
      data: assessmentSetup
    });
  } catch (error: any) {
    console.error("Get questions error:", error.message);
    return res.status(500).json({
      message: "Failed to get questions based on CV",
      error: error.message
    });
  }
};

// Endpoint 2: Submit assessment answers và lấy evaluation
export const submitAndEvaluate = async (req: Request, res: Response) => {
  try {
    const { user_id, attempt_id, roadmap_id } = req.body;

    if (!user_id || !attempt_id || !roadmap_id) {
      return res.status(400).json({
        message: "user_id, attempt_id, and roadmap_id are required"
      });
    }

    // Phân tích kết quả
    const evaluation = await analyzeAssessmentResults(user_id, attempt_id, roadmap_id);

    return res.status(200).json({
      message: "Assessment evaluated successfully",
      data: evaluation
    });
  } catch (error: any) {
    console.error("Evaluate error:", error.message);
    return res.status(500).json({
      message: "Failed to evaluate assessment",
      error: error.message
    });
  }
};
