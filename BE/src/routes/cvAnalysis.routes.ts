import express from "express";
import {
  analyzeCVAndGetCapability,
  getCapabilityReport
} from "../controllers/cvAnalysis.controller";

const router = express.Router();

// Analyze CV và lấy capability report
router.post("/analyze-capability", analyzeCVAndGetCapability);

// Lấy capability report
router.get("/capability/:user_id", getCapabilityReport);

export default router;
