import { Request, Response } from "express";
import {
  analyzeCV_ForSkills,
  compareSkillsWithRoadmap,
  saveCVAnalysisReport
} from "../services/cvAnalysis.service";

// Endpoint để phân tích CV và xem năng lực
export const analyzeCVAndGetCapability = async (req: Request, res: Response) => {
  try {
    const { cvContent, user_id } = req.body;

    if (!cvContent || !user_id) {
      return res.status(400).json({
        message: "CV content and user_id are required"
      });
    }

    // Bước 1: Phân tích CV để trích xuất skills
    const cvAnalysis = await analyzeCV_ForSkills(cvContent);

    // Bước 2: So sánh với roadmap
    const capabilityReport = await compareSkillsWithRoadmap(user_id, cvAnalysis);

    // Bước 3: Lưu báo cáo
    await saveCVAnalysisReport(user_id, cvContent, capabilityReport);

    return res.status(200).json({
      message: "CV analysis and capability assessment completed",
      data: {
        cv_analysis: cvAnalysis,
        capability_report: capabilityReport
      }
    });
  } catch (error: any) {
    console.error("CV analysis and capability error:", error.message);
    return res.status(500).json({
      message: "Failed to analyze CV and assess capability",
      error: error.message
    });
  }
};

// Endpoint để lấy capability report đã lưu
export const getCapabilityReport = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        message: "user_id is required"
      });
    }

    // Placeholder - lấy report gần nhất
    return res.status(200).json({
      message: "Get capability report success",
      data: {}
    });
  } catch (error: any) {
    console.error("Get capability report error:", error.message);
    return res.status(500).json({
      message: "Failed to get capability report",
      error: error.message
    });
  }
};
