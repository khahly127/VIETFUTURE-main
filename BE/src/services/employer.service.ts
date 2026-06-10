import { prisma } from "../config/prisma";
import { askAIService } from "./ai.service";

const getEmployerByUserId = async (userId: number) => {
  let employer = await prisma.employer.findUnique({
    where: {
      userId,
    },
  });

  if (!employer) {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
    });
    if (!user) {
      throw new Error("User not found");
    }

    employer = await prisma.employer.create({
      data: {
        userId,
        companyName: user.full_name,
        description: "Thông tin công ty đang cập nhật",
      },
    });
  }

  return employer;
};


const getOrCreateSubscription = async (employerId: string) => {
  let subscription = await prisma.employerSubscription.findFirst({
    where: { employerId },
  });

  if (!subscription) {
    subscription = await prisma.employerSubscription.create({
      data: {
        employerId,
        planType: "FREE",
        jobLimit: 3,
        cvViewLimit: 10,
      },
    });
  }

  return subscription;
};

export const getEmployerOverviewService = async (userId: number) => {
  const employer = await getEmployerByUserId(userId);

  const totalJobs = await prisma.jobPost.count({
    where: {
      employerId: employer.id,
    },
  });

  const totalApplications = await prisma.jobApplication.count({
    where: {
      jobPost: {
        employerId: employer.id,
      },
    },
  });

  const applicationsByStatus = await prisma.jobApplication.groupBy({
    by: ["status"],
    where: {
      jobPost: {
        employerId: employer.id,
      },
    },
    _count: {
      status: true,
    },
  });

  const recentApplicants = await prisma.jobApplication.findMany({
    where: {
      jobPost: {
        employerId: employer.id,
      },
    },
    orderBy: {
      appliedAt: "desc",
    },
    take: 5,
    include: {
      user: {
        select: {
          user_id: true,
          full_name: true,
          email: true,
        },
      },
      jobPost: {
        select: {
          title: true,
        },
      },
    },
  });

  const subscription = await getOrCreateSubscription(employer.id);

  return {
    companyName: employer.companyName,
    totalJobs,
    totalApplications,
    subscription: {
      planType: subscription.planType,
      jobLimit: subscription.jobLimit,
      cvViewLimit: subscription.cvViewLimit,
    },
    applicationsByStatus: applicationsByStatus.reduce((acc, item) => {
      const statusStr = item.status === 1 ? "reviewed" : item.status === 2 ? "rejected" : "pending";
      acc[statusStr] = (acc[statusStr] || 0) + item._count.status;
      return acc;
    }, {} as Record<string, number>),
    recentApplicants: recentApplicants.map((application) => ({
      application_id: application.id,
      status: application.status,
      applied_at: application.appliedAt,
      candidate: application.user,
      jobTitle: application.jobPost.title,
    })),
  };
};

export const getEmployerCandidatesService = async (
  skill?: string,
  minScore?: number
) => {
  const where: any = {
    role: "student",
  };

  if (minScore !== undefined) {
    where.attempts = {
      some: {
        score: {
          gte: minScore,
        },
        status: "completed",
      },
    };
  }

  if (skill) {
    where.AND = [
      {
        OR: [
          {
            attempts: {
              some: {
                assessment: {
                  title: {
                    contains: skill,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
          {
            reports: {
              some: {
                strengths: {
                  contains: skill,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            reports: {
              some: {
                weaknesses: {
                  contains: skill,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      },
    ];
  }

  const students = await prisma.user.findMany({
    where,
    select: {
      user_id: true,
      full_name: true,
      email: true,
      phone: true,
      status: true,
      roadmaps: {
        orderBy: {
          created_at: "desc",
        },
        take: 1,
        select: {
          title: true,
          career: {
            select: {
              career_name: true,
            },
          },
          progress_percent: true,
          status: true,
        },
      },
      attempts: {
        where: {
          status: "completed",
        },
        orderBy: {
          score: "desc",
        },
        take: 1,
        select: {
          score: true,
          submitted_at: true,
          assessment: {
            select: {
              title: true,
            },
          },
        },
      },
      reports: {
        orderBy: {
          created_at: "desc",
        },
        take: 1,
        select: {
          overall_score: true,
          strengths: true,
          weaknesses: true,
        },
      },
    },
    take: 20,
    orderBy: {
      updated_at: "desc",
    },
  });

  return students.map((student) => ({
    user_id: student.user_id,
    full_name: student.full_name,
    email: student.email,
    phone: student.phone,
    status: student.status,
    latestRoadmap: student.roadmaps[0] || null,
    latestAttempt: student.attempts[0] || null,
    latestReport: student.reports[0] || null,
  }));
};

export const getEmployerJobsService = async (userId: number) => {
  const employer = await getEmployerByUserId(userId);

  const jobs = await prisma.jobPost.findMany({
    where: {
      employerId: employer.id,
    },
    include: {
      skills: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return jobs.map((job) => ({
    ...job,
    job_id: job.id,
    status: job.status === 1 ? "Đang tuyển" : "Đã đóng",
    required_skills: job.skills.map((s) => s.skillId).join(", "),
    location: job.location,
    salary_range: job.salary_range,
  }));
};

export const getPublicJobsService = async () => {
  const jobs = await prisma.jobPost.findMany({
    where: {
      status: 1,
      OR: [
        { expiresAt: null },
        {
          expiresAt: {
            gt: new Date(),
          },
        },
      ],
    },
    include: {
      skills: true,
      employer: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return jobs.map((job) => ({
    ...job,
    job_id: job.id,
    status: job.status === 1 ? "Đang tuyển" : "Đã đóng",
    required_skills: job.skills.map((s) => s.skillId).join(", "),
    company_name: job.employer.companyName,
    company_logo: job.employer.logo || "",
    company_description: job.employer.description || "",
    company_contact_email: job.employer.user.email,
  }));
};

export const createJobPostingService = async (userId: number, data: any) => {
  const employer = await getEmployerByUserId(userId);

  const createdJob = await prisma.jobPost.create({
    data: {
      employerId: employer.id,
      title: data.title,
      description: data.description,
      requirements: data.requirements || data.description || "",
      location: data.location || data.jobLocation || "",
      salary_range: data.salary_range || data.salary || data.salary_range || "",
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      status: data.status !== undefined ? Number(data.status) : 1,
    },
  });

  const skills = data.skills || data.skillIds || data.required_skills;

  if (skills) {
    const skillItems = Array.isArray(skills)
      ? skills
      : String(skills)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

    await Promise.all(
      skillItems.map((skillId: string) =>
        prisma.jobSkill.create({
          data: {
            jobPostId: createdJob.id,
            skillId,
          },
        })
      )
    );
  }

  return createdJob;
};

export const updateJobPostingService = async (userId: number, jobId: string, data: any) => {
  const employer = await getEmployerByUserId(userId);
  
  const existingJob = await prisma.jobPost.findUnique({
    where: { id: jobId },
  });

  if (!existingJob) {
    throw new Error("Job posting not found");
  }

  if (existingJob.employerId !== employer.id) {
    throw new Error("Unauthorized to access this job posting");
  }

  const updatedJob = await prisma.jobPost.update({
    where: {
      id: jobId,
    },
    data: {
      title: data.title,
      description: data.description,
      requirements: data.requirements || data.description || "",
      location: data.location || data.jobLocation || "",
      salary_range: data.salary_range || data.salary || data.salary_range || "",
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      status: data.status !== undefined ? Number(data.status) : undefined,
    },
  });

  const skills = data.skills || data.skillIds || data.required_skills;

  if (skills !== undefined) {
    await prisma.jobSkill.deleteMany({
      where: {
        jobPostId: jobId,
      },
    });

    const skillItems = Array.isArray(skills)
      ? skills
      : String(skills)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

    await Promise.all(
      skillItems.map((skillId: string) =>
        prisma.jobSkill.create({
          data: {
            jobPostId: jobId,
            skillId,
          },
        })
      )
    );
  }

  return updatedJob;
};

export const deleteJobPostingService = async (userId: number, jobId: string) => {
  const employer = await getEmployerByUserId(userId);
  
  const existingJob = await prisma.jobPost.findUnique({
    where: { id: jobId },
  });

  if (!existingJob) {
    throw new Error("Job posting not found");
  }

  if (existingJob.employerId !== employer.id) {
    throw new Error("Unauthorized to access this job posting");
  }

  // Delete associated skills
  await prisma.jobSkill.deleteMany({
    where: {
      jobPostId: jobId,
    },
  });

  // Delete associated applications
  await prisma.jobApplication.deleteMany({
    where: {
      jobPostId: jobId,
    },
  });

  // Delete the job post
  await prisma.jobPost.delete({
    where: {
      id: jobId,
    },
  });
};


export const getEmployerApplicationsService = async (userId: number) => {
  const employer = await getEmployerByUserId(userId);

  const applications = await prisma.jobApplication.findMany({
    where: {
      jobPost: {
        employerId: employer.id,
      },
    },
    orderBy: {
      appliedAt: "desc",
    },
    include: {
      user: {
        select: {
          user_id: true,
          full_name: true,
          email: true,
          phone: true,
          attempts: {
            where: {
              status: "completed",
            },
            orderBy: {
              score: "desc",
            },
            take: 1,
            select: {
              score: true,
            },
          },
          reports: {
            orderBy: {
              created_at: "desc",
            },
            take: 1,
            select: {
              strengths: true,
              weaknesses: true,
            },
          },
        },
      },
      jobPost: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return applications.map((app) => ({
    application_id: app.id,
    status: app.status,
    statusText: app.status === 1 ? "đã duyệt" : app.status === 2 ? "từ chối" : "đang xét tuyển",
    submitted_at: app.appliedAt,
    cv_url: app.cvUrl,
    student: {
      user_id: app.user.user_id,
      full_name: app.user.full_name,
      email: app.user.email,
      phone: app.user.phone || "",
      score: app.user.attempts[0]?.score ?? null,
      strengths: app.user.reports[0]?.strengths || null,
      weaknesses: app.user.reports[0]?.weaknesses || null,
    },
    job: {
      id: app.jobPost.id,
      title: app.jobPost.title,
    },
  }));
};

export const updateApplicationStatusService = async (userId: number, applicationId: string, status: number) => {
  const employer = await getEmployerByUserId(userId);

  const application = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
    include: {
      jobPost: true,
    },
  });

  if (!application) {
    throw new Error("Không tìm thấy đơn ứng tuyển");
  }

  if (application.jobPost.employerId !== employer.id) {
    throw new Error("Bạn không có quyền chỉnh sửa đơn ứng tuyển này");
  }

  const updatedApplication = await prisma.jobApplication.update({
    where: { id: applicationId },
    data: {
      status,
    },
  });

  return updatedApplication;
};

export const getEmployerAIReportService = async (userId: number) => {
  const employer = await getEmployerByUserId(userId);

  const applications = await prisma.jobApplication.findMany({
    where: {
      jobPost: {
        employerId: employer.id,
      },
    },
    include: {
      user: {
        select: {
          full_name: true,
          email: true,
          attempts: {
            where: { status: "completed" },
            orderBy: { score: "desc" },
            take: 1,
            select: { score: true },
          },
          reports: {
            orderBy: { created_at: "desc" },
            take: 1,
            select: { strengths: true, weaknesses: true },
          },
        },
      },
      jobPost: {
        select: {
          title: true,
        },
      },
    },
  });

  if (applications.length === 0) {
    return "Hiện tại chưa có ứng viên nào nộp hồ sơ ứng tuyển vào các vị trí của doanh nghiệp để phân tích AI.";
  }

  const summaryList = applications.map((app, index) => {
    const score = app.user.attempts[0]?.score;
    const strengths = app.user.reports[0]?.strengths || "Chưa có đánh giá";
    const scoreText = score !== undefined ? `${score}%` : "Chưa làm bài test";
    return `${index + 1}. Họ tên: ${app.user.full_name} | Vị trí: ${app.jobPost.title} | Điểm đánh giá: ${scoreText} | Điểm mạnh: ${strengths}`;
  }).join("\n");

  const prompt = `
Bạn là một Chuyên gia Tuyển dụng AI (AI Recruitment Advisor) cho công ty "${employer.companyName}".
Hãy phân tích danh sách các ứng viên nộp hồ sơ dưới đây và đề xuất một báo cáo đánh giá tuyển dụng ngắn gọn nhưng cực kỳ trực quan, chuyên nghiệp bằng tiếng Việt:
1. Đánh giá tổng quan chất lượng nguồn lực ứng viên đang có.
2. Đề xuất top ứng viên tiềm năng sáng giá nhất dựa trên điểm kiểm tra năng lực và điểm mạnh thực tế.
3. Gợi ý cụ thể các bước hành động tiếp theo cho nhà tuyển dụng (ví dụ: cần tập trung phỏng vấn kiểm tra sâu về kỹ năng nào ở từng bạn).

Hãy trình bày báo cáo bằng định dạng Markdown sạch đẹp, có tiêu đề và các phần phân biệt rõ ràng.

Danh sách ứng viên:
${summaryList}
  `;

  const report = await askAIService(prompt);
  return report;
};

export const getCompanyProfileService = async (userId: number) => {
  const employer = await prisma.employer.findUnique({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          phone: true,
        },
      },
    },
  });

  if (!employer) {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
    });
    if (!user) return null;
    return {
      company_name: user.full_name,
      website: "",
      description: "Thông tin công ty đang cập nhật",
      phone: user.phone || "",
      location: "",
      industry: "",
    };
  }

  return {
    ...employer,
    company_name: employer.companyName,
    location: employer.address,
    phone: employer.user.phone || "",
    industry: "",
  };
};

export const upsertCompanyProfileService = async (
  userId: number,
  data: any
) => {
  if (data.phone !== undefined) {
    await prisma.user.update({
      where: { user_id: userId },
      data: { phone: data.phone },
    });
  }

  const employer = await prisma.employer.upsert({
    where: {
      userId,
    },
    update: {
      companyName: data.company_name || data.companyName,
      website: data.website,
      description: data.description,
      logo: data.logo || data.logo_url,
      banner: data.banner || data.banner_url,
      address: data.address || data.location,
      isVerified: data.isVerified ?? undefined,
    },
    create: {
      userId,
      companyName: data.company_name || data.companyName || "",
      website: data.website,
      description: data.description,
      logo: data.logo || data.logo_url,
      banner: data.banner || data.banner_url,
      address: data.address || data.location,
      isVerified: data.isVerified ?? false,
    },
    include: {
      user: {
        select: {
          phone: true,
        },
      },
    },
  });

  return {
    ...employer,
    company_name: employer.companyName,
    location: employer.address,
    phone: employer.user.phone || "",
    industry: "",
  };
};

export const applyForJobService = async (userId: number, jobId: string, cvPath: string | undefined) => {
  const job = await prisma.jobPost.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    throw new Error("Job posting not found");
  }

  const existingApplication = await prisma.jobApplication.findFirst({
    where: {
      userId,
      jobPostId: jobId,
    },
  });

  if (existingApplication) {
    throw new Error("Bạn đã nộp đơn ứng tuyển cho công việc này rồi.");
  }

  const application = await prisma.jobApplication.create({
    data: {
      userId,
      jobPostId: jobId,
      cvUrl: cvPath || "",
      status: 0,
    },
  });

  return application;
};

export const upgradeEmployerSubscriptionService = async (userId: number) => {
  const employer = await getEmployerByUserId(userId);

  let subscription = await prisma.employerSubscription.findFirst({
    where: { employerId: employer.id },
  });

  const next30Days = new Date();
  next30Days.setDate(next30Days.getDate() + 30);

  if (!subscription) {
    subscription = await prisma.employerSubscription.create({
      data: {
        employerId: employer.id,
        planType: "PREMIUM",
        jobLimit: 15,
        cvViewLimit: 50,
        endDate: next30Days,
      },
    });
  } else {
    subscription = await prisma.employerSubscription.update({
      where: { id: subscription.id },
      data: {
        planType: "PREMIUM",
        jobLimit: 15,
        cvViewLimit: 50,
        endDate: next30Days,
      },
    });
  }

  return subscription;
};
