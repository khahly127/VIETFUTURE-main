import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import courseRoutes from "./routes/course.routes";
import roadmapRoutes from "./routes/roadmap.routes";
import skillRoutes from "./routes/skill.routes";
import careerPathRoutes from "./routes/careerPath.routes";
import careerSkillRoutes from "./routes/careerSkill.routes";
import roadmapCourseRoutes from "./routes/roadmapCourse.routes";
import courseSkillRoutes from "./routes/courseSkill.routes";
import aichathistoryRoutes from "./routes/aichathistory.routes";
import aiRoutes from "./routes/ai.routes";
import assessmentRoutes from "./routes/assessment.routes";
import employerRoutes from "./routes/employer.routes";
import cozeRoutes from "./routes/coze.routes";
import cvAnalysisRoutes from "./routes/cvAnalysis.routes";
import cvBasedAssessmentRoutes from "./routes/cvBasedAssessment.routes";
import { getPublicJobs } from "./controllers/employer.controller";

const app = express();

// Middleware
app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use("/public", express.static(path.join(__dirname, "../public")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/careers", careerPathRoutes);
//app.use("/api/career-skills", careerSkillRoutes);
app.use("/api/roadmap-courses", roadmapCourseRoutes);
//app.use("/api/course-skills", courseSkillRoutes);
app.use("/api/ai-chat-history", aichathistoryRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/coze", cozeRoutes);
app.use("/api/cv-analysis", cvAnalysisRoutes);
app.use("/api/cv-assessment", cvBasedAssessmentRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/careerPaths", careerPathRoutes);
app.use("/api/courseSkills", courseSkillRoutes);
app.use("/api/careerSkills", careerSkillRoutes);
app.get("/api/employer/public-jobs", getPublicJobs);
app.use("/api/employer", employerRoutes);

// Health check
app.get("/", (req, res) => {
  return res.json({
    message: "VietFuture API running",
  });
});

// 404
app.use((req, res) => {
  return res.status(404).json({
    message: "Route not found",
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});

export default app;
