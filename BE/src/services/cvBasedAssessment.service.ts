import { prisma } from "../config/prisma";

interface CVAnalysisForRole {
  detected_role: string;
  detected_level: string;
  skills: string[];
  confidence: number;
}

interface AssessmentWithQuestions {
  assessment_id: number;
  title: string;
  total_questions: number;
  questions: any[];
}

// Extract role từ CV dựa trên keywords
const detectRoleFromCV = (cvContent: string): CVAnalysisForRole => {
  const lowerCV = cvContent.toLowerCase();

  const roleKeywords = {
    "Backend Engineer": ["backend", "node", "python", "java", "spring", "django", "express", "rest api"],
    "Frontend Engineer": ["frontend", "react", "vue", "angular", "javascript", "css", "html", "next.js"],
    "Full Stack Developer": ["full stack", "node", "react", "vue", "mongo", "sql"],
    "DevOps Engineer": ["devops", "docker", "kubernetes", "aws", "ci/cd", "jenkins", "terraform"],
    "Data Science": ["data", "machine learning", "python", "tensorflow", "pytorch", "analytics"],
    "Mobile Developer": ["mobile", "react native", "flutter", "ios", "android", "swift"],
    "QA Engineer": ["qa", "test", "selenium", "jest", "mocha", "testing"]
  };

  const levelKeywords = {
    "senior": ["senior", "lead", "principal", "architect", "5 year", "5year", "6 year", "7 year"],
    "mid": ["mid", "middle", "3 year", "3year", "4 year", "4year"],
    "junior": ["junior", "1 year", "1year", "2 year", "2year", "intern", "graduate"]
  };

  let detectedRole = "Backend Engineer";
  let maxMatches = 0;

  for (const [role, keywords] of Object.entries(roleKeywords)) {
    const matches = keywords.filter(kw => lowerCV.includes(kw)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedRole = role;
    }
  }

  let detectedLevel = "junior";
  for (const [level, keywords] of Object.entries(levelKeywords)) {
    if (keywords.some(kw => lowerCV.includes(kw))) {
      detectedLevel = level;
      break;
    }
  }

  // Lấy skills từ CV
  const skillKeywords = [
    'nodejs', 'node.js', 'express', 'python', 'django', 'flask', 'java', 'spring',
    'php', 'laravel', 'react', 'vue', 'angular', 'typescript', 'javascript',
    'mongodb', 'mysql', 'postgres', 'redis', 'docker', 'kubernetes', 'aws'
  ];

  const skills = skillKeywords.filter(skill => lowerCV.includes(skill));
  const confidence = Math.min(100, (maxMatches / 3) * 100);

  return {
    detected_role: detectedRole,
    detected_level: detectedLevel,
    skills,
    confidence: Math.round(confidence)
  };
};

// Lấy assessment phù hợp cho role
export const getAssessmentForRole = async (
  cvContent: string
): Promise<AssessmentWithQuestions> => {
  try {
    const roleAnalysis = detectRoleFromCV(cvContent);
    console.log("Detected role:", roleAnalysis);

    // Normalize role name
    const normalizedRole = (() => {
      const role = roleAnalysis.detected_role;
      if (role.includes("Backend")) return "Backend Engineer";
      if (role.includes("Frontend")) return "Frontend Engineer";
      if (role.includes("Full Stack")) return "Full Stack Developer";
      if (role.includes("DevOps")) return "DevOps Engineer";
      if (role.includes("Data")) return "Data Science";
      return "Backend Engineer";
    })();

    // Tìm assessment trong database
    let assessment = await prisma.assessment.findFirst({
      where: {
        title: {
          contains: normalizedRole
        }
      },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    });

    if (!assessment) {
      assessment = await prisma.assessment.findFirst({
        where: { title: "Backend Engineer" }, // Default
        include: {
          questions: {
            include: {
              options: true
            }
          }
        }
      });
    }

    if (!assessment) {
      throw new Error("No assessment found in database");
    }

    // Cast to include questions
    const assessmentWithQuestions = assessment as any;

    return {
      assessment_id: assessment.assessment_id,
      title: assessment.title,
      total_questions: assessment.total_questions || assessmentWithQuestions.questions?.length || 0,
      questions: assessmentWithQuestions.questions || []
    };
  } catch (error: any) {
    console.error("Get assessment error:", error.message);
    throw new Error("Failed to get assessment");
  }
};

// Phân tích kết quả assessment
export const analyzeAssessmentResults = async (
  userId: number,
  assessmentAttemptId: number,
  roadmapId: number
): Promise<any> => {
  try {
    // Lấy attempt info
    const attempt = await prisma.assessmentAttempt.findUnique({
      where: { attempt_id: assessmentAttemptId },
      include: {
        assessment: true,
        answers: {
          include: {
            selectedOption: true,
            question: true
          }
        }
      }
    });

    if (!attempt) {
      throw new Error("Assessment attempt not found");
    }

    // Tính score
    let correctAnswers = 0;
    let totalScore = 0;
    let maxScore = 0;

    attempt.answers.forEach(answer => {
      if (answer.selectedOption?.is_correct) {
        correctAnswers++;
      }
      totalScore += answer.score || 0;
      maxScore += answer.question?.score || 1;
    });

    const scorePercentage = attempt.answers.length > 0
      ? Math.round((correctAnswers / attempt.answers.length) * 100)
      : 0;

    // Lấy roadmap để so sánh
    const roadmap = await prisma.roadmap.findUnique({
      where: { roadmap_id: roadmapId },
      include: {
        career: {
          include: {
            careerSkills: {
              include: {
                skill: true
              }
            }
          }
        }
      }
    });

    if (!roadmap) {
      throw new Error("Roadmap not found");
    }

    // Tạo recommendations
    const recommendations: string[] = [];

    if (scorePercentage >= 80) {
      recommendations.push("✅ Bạn đã đạt mức cơ bản cho vị trí này!");
      recommendations.push("💪 Tiếp tục phát triển các kỹ năng nâng cao.");
    } else if (scorePercentage >= 60) {
      recommendations.push("⏳ Bạn cần tập trung vào các kiến thức chính.");
      recommendations.push("📚 Hoàn thành các khóa học cơ bản trong roadmap.");
    } else {
      recommendations.push("🚀 Còn nhiều kỹ năng cần học.");
      recommendations.push("📖 Bắt đầu với các khóa học Foundation.");
    }

    recommendations.push(`💡 Mục tiêu: Đạt ${80}% hoặc hơn.`);

    const report = {
      attempt_id: assessmentAttemptId,
      assessment_title: attempt.assessment.title,
      career_path: roadmap.career.career_name,
      score_percentage: scorePercentage,
      correct_answers: correctAnswers,
      total_questions: attempt.answers.length,
      roadmap_id: roadmapId,
      recommendations
    };

    // Lưu report
    await prisma.skillReport.create({
      data: {
        user_id: userId,
        attempt_id: assessmentAttemptId,
        overall_score: scorePercentage,
        strengths: `Assessment Score: ${scorePercentage}%`,
        weaknesses: `Correct Answers: ${correctAnswers}/${attempt.answers.length}`,
        recommendations: recommendations.join("; ")
      }
    });

    return report;
  } catch (error: any) {
    console.error("Analysis error:", error.message);
    throw new Error("Failed to analyze assessment results");
  }
};

// Tạo CV-based assessment attempt
export const createCVBasedAssessment = async (
  userId: number,
  cvContent: string,
  roadmapId: number
): Promise<any> => {
  try {
    // Lấy assessment từ CV
    const assessment = await getAssessmentForRole(cvContent);

    // Tạo attempt
    const attempt = await prisma.assessmentAttempt.create({
      data: {
        user_id: userId,
        assessment_id: assessment.assessment_id,
        status: "in_progress",
        started_at: new Date()
      }
    });

    console.log(`Created assessment attempt: ${attempt.attempt_id}`);

    return {
      attempt_id: attempt.attempt_id,
      assessment: assessment,
      cv_analysis: null
    };
  } catch (error: any) {
    console.error("Create assessment error:", error.message);
    throw new Error("Failed to create CV-based assessment");
  }
};
