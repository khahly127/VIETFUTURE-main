import { Request, Response } from "express";
import {
  getEmployerOverviewService,
  getEmployerCandidatesService,
  getEmployerJobsService,
  createJobPostingService,
  getEmployerApplicationsService,
  getPublicJobsService,
  getCompanyProfileService,
  upsertCompanyProfileService,
  updateJobPostingService,
  deleteJobPostingService,
  applyForJobService,
  updateApplicationStatusService,
  getEmployerAIReportService,
  upgradeEmployerSubscriptionService,
} from "../services/employer.service";

export const getEmployerOverview = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const overview = await getEmployerOverviewService(user.user_id);
    return res.json(overview);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to load employer overview",
    });
  }
};

export const getEmployerCandidates = async (req: Request, res: Response) => {
  try {
    const skill = req.query.skill as string | undefined;
    const minScore = req.query.minScore ? Number(req.query.minScore) : undefined;

    const candidates = await getEmployerCandidatesService(skill, minScore);
    return res.json(candidates);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to load candidates",
    });
  }
};

export const getEmployerJobs = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const jobs = await getEmployerJobsService(user.user_id);
    return res.json(jobs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to load employer jobs",
    });
  }
};

export const createEmployerJob = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const job = await createJobPostingService(user.user_id, req.body);
    return res.status(201).json(job);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to create job posting",
    });
  }
};

export const getEmployerApplications = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const applications = await getEmployerApplicationsService(user.user_id);
    return res.json(applications);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to load applications",
    });
  }
};

export const getPublicJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await getPublicJobsService();
    return res.json(jobs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to load public job postings",
    });
  }
};

export const getCompanyProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const profile = await getCompanyProfileService(user.user_id);
    return res.json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to load company profile",
    });
  }
};

export const updateCompanyProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const profile = await upsertCompanyProfileService(user.user_id, req.body);
    return res.json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to update company profile",
    });
  }
};

export const updateEmployerJob = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const jobId = req.params.id as string;
    const job = await updateJobPostingService(user.user_id, jobId, req.body);
    return res.json(job);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to update job posting",
    });
  }
};

export const deleteEmployerJob = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const jobId = req.params.id as string;
    await deleteJobPostingService(user.user_id, jobId);
    return res.json({ message: "Job posting deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to delete job posting",
    });
  }
};

export const applyForJob = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const jobId = req.params.id as string;
    
    const file = req.file;
    let cvPath = "";
    if (file) {
      cvPath = `/public/uploads/${file.filename}`;
    } else if (req.body.cvUrl) {
      cvPath = req.body.cvUrl;
    }

    if (!cvPath) {
      return res.status(400).json({ message: "Vui lòng tải lên CV hoặc cung cấp link CV." });
    }

    const application = await applyForJobService(user.user_id, jobId, cvPath);
    return res.status(201).json(application);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Failed to apply for job posting",
    });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const applicationId = req.params.id as string;
    const status = Number(req.body.status);

    if (isNaN(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const application = await updateApplicationStatusService(user.user_id, applicationId, status);
    return res.json(application);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Lỗi khi cập nhật trạng thái ứng tuyển",
    });
  }
};

export const getEmployerAIReport = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const report = await getEmployerAIReportService(user.user_id);
    return res.json({ report });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Lỗi khi tạo báo cáo tuyển dụng bằng AI",
    });
  }
};

export const upgradeEmployerSubscription = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const subscription = await upgradeEmployerSubscriptionService(user.user_id);
    return res.json({
      message: "Nâng cấp gói dịch vụ thành công!",
      subscription,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Lỗi khi nâng cấp gói dịch vụ B2B",
    });
  }
};

export const uploadCompanyLogo = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Vui lòng chọn tệp ảnh Logo" });
    }
    const logoPath = `/public/uploads/${file.filename}`;
    const profile = await upsertCompanyProfileService(user.user_id, { logo: logoPath });
    return res.json({
      message: "Tải lên logo thành công",
      logo: logoPath,
      profile,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Lỗi khi tải lên Logo công ty",
    });
  }
};

export const uploadCompanyBanner = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Vui lòng chọn tệp ảnh Banner" });
    }
    const bannerPath = `/public/uploads/${file.filename}`;
    const profile = await upsertCompanyProfileService(user.user_id, { banner: bannerPath });
    return res.json({
      message: "Tải lên banner thành công",
      banner: bannerPath,
      profile,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Lỗi khi tải lên Banner giới thiệu",
    });
  }
};

