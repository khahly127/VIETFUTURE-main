import express from "express";
import {
  getEmployerOverview,
  getEmployerCandidates,
  getEmployerJobs,
  createEmployerJob,
  updateEmployerJob,
  deleteEmployerJob,
  getEmployerApplications,
  getPublicJobs,
  getCompanyProfile,
  updateCompanyProfile,
  applyForJob,
  updateApplicationStatus,
  getEmployerAIReport,
  upgradeEmployerSubscription,
  uploadCompanyLogo,
  uploadCompanyBanner,
} from "../controllers/employer.controller";
import {
  authorizeEnterprise,
  verifyToken,
} from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = express.Router();

router.get("/public-jobs", getPublicJobs);
router.post("/public-jobs/:id/apply", verifyToken, upload.single("cv"), applyForJob);
router.use(verifyToken, authorizeEnterprise);

router.get("/overview", getEmployerOverview);
router.get("/candidates", getEmployerCandidates);
router.get("/jobs", getEmployerJobs);
router.post("/jobs", createEmployerJob);
router.put("/jobs/:id", updateEmployerJob);
router.delete("/jobs/:id", deleteEmployerJob);
router.get("/applications", getEmployerApplications);
router.put("/applications/:id/status", updateApplicationStatus);
router.get("/ai-report", getEmployerAIReport);
router.post("/upgrade", upgradeEmployerSubscription);
router.get("/company-profile", getCompanyProfile);
router.put("/company-profile", updateCompanyProfile);
router.post("/company-profile/logo", upload.single("logo"), uploadCompanyLogo);
router.post("/company-profile/banner", upload.single("banner"), uploadCompanyBanner);

export default router;

