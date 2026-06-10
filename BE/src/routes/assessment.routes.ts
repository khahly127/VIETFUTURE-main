import { Router } from "express";
import * as assessmentController from "../controllers/assessment.controller";

const router = Router();

router.get("/", assessmentController.getAllAssessments);
router.get("/attempts", assessmentController.getAllAttempts);
router.get("/role/:role", assessmentController.getAssessmentByRole);
router.post("/", assessmentController.createAssessment);
router.post("/attempts", assessmentController.createAttempt);
router.post("/skill-reports", assessmentController.createSkillReport);   // ← MỚI: lưu SkillReport
router.post("/answers", assessmentController.createUserAnswer);           // ← MỚI: lưu UserAnswer
router.post("/:id/questions", assessmentController.createQuestion);
router.put("/:id", assessmentController.updateAssessment);
router.delete("/attempts/:id", assessmentController.deleteAttempt);
router.delete("/:id", assessmentController.deleteAssessment);
router.delete("/questions/:questionId", assessmentController.deleteQuestion);

export default router;