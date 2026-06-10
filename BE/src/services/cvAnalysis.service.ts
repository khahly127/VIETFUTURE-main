import { prisma } from "../config/prisma";

interface CVAnalysisResult {
  extractedSkills: string[];
  experienceLevel: string;
  technicalLevel: number;
}

interface SkillMatch {
  skill_id: number;
  skill_name: string;
  required_level: string;
  user_level: string;
  gap: number;
  percentage: number;
}

interface RoadmapCapabilityReport {
  career_name: string;
  roadmap_id: number;
  overall_score: number;
  matched_skills: SkillMatch[];
  missing_skills: SkillMatch[];
  recommendations: string[];
}

// Helper: Extract skills từ CV text bằng simple parsing
const extractSkillsFromCV = (cvContent: string): string[] => {
  const skillKeywords = [
    // Backend
    'nodejs', 'node.js', 'express', 'python', 'django', 'flask', 'java', 'spring',
    'php', 'laravel', 'go', 'rust', 'dotnet', '.net', 'c#', 'fastapi',
    // Frontend
    'react', 'vue', 'angular', 'nextjs', 'next.js', 'typescript', 'javascript',
    'html', 'css', 'tailwind', 'bootstrap', 'svelte', 'webpack', 'vite',
    // Database
    'mongodb', 'mysql', 'postgres', 'postgresql', 'redis', 'elasticsearch', 'firebase',
    'cassandra', 'oracle', 'dynamodb',
    // DevOps
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'gitlab', 'github',
    'terraform', 'ansible', 'nginx', 'linux',
    // Tools
    'git', 'eslint', 'jest', 'mocha', 'graphql', 'rest', 'api', 'sql', 'nosql',
    // Other
    'machine learning', 'ai', 'data science', 'deep learning', 'nlp', 'cv'
  ];

  const foundSkills = new Set<string>();
  const lowerCV = cvContent.toLowerCase();

  skillKeywords.forEach(skill => {
    if (lowerCV.includes(skill)) {
      foundSkills.add(skill);
    }
  });

  return Array.from(foundSkills);
};

// Phân tích CV để trích xuất skills (simplified version)
export const analyzeCV_ForSkills = async (cvContent: string): Promise<CVAnalysisResult> => {
  try {
    const extractedSkills = extractSkillsFromCV(cvContent);

    // Đoán mức độ kinh nghiệm dựa trên keywords
    let experienceLevel = "junior";
    let technicalLevel = 1;

    const lowerCV = cvContent.toLowerCase();

    if (lowerCV.includes('senior') || lowerCV.includes('principal') || lowerCV.includes('lead')) {
      experienceLevel = "senior";
      technicalLevel = 5;
    } else if (lowerCV.includes('mid') || lowerCV.includes('middle') || lowerCV.includes('3 year') || lowerCV.includes('3year')) {
      experienceLevel = "mid";
      technicalLevel = 3;
    } else if (lowerCV.includes('2 year') || lowerCV.includes('2year')) {
      technicalLevel = 2;
    } else if (lowerCV.includes('4 year') || lowerCV.includes('4year') || lowerCV.includes('5 year')) {
      experienceLevel = "mid";
      technicalLevel = 4;
    }

    console.log(`CV Analysis: Found ${extractedSkills.length} skills, Level: ${experienceLevel}`);

    return {
      extractedSkills,
      experienceLevel,
      technicalLevel
    };
  } catch (error: any) {
    console.error("CV analysis error:", error.message);
    throw new Error("Failed to analyze CV for skills");
  }
};

// So sánh kỹ năng người dùng với roadmap
export const compareSkillsWithRoadmap = async (
  userId: number,
  analysisResult: CVAnalysisResult
): Promise<RoadmapCapabilityReport> => {
  try {
    // Lấy roadmap của user
    const roadmap = await prisma.roadmap.findFirst({
      where: { user_id: userId },
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
      throw new Error("User has no roadmap");
    }

    // Map skills và tính điểm
    const requiredSkills = roadmap.career.careerSkills;
    const userSkills = analysisResult.extractedSkills.map(s => s.toLowerCase());

    let matchedSkills: SkillMatch[] = [];
    let missingSkills: SkillMatch[] = [];
    let totalScore = 0;

    for (const careerSkill of requiredSkills) {
      const skillName = careerSkill.skill.skill_name.toLowerCase();
      const hasSkill = userSkills.some(
        us => us.includes(skillName) || skillName.includes(us) || skillName.includes(us.split(/[\s\-]/)[0])
      );

      // Tính mức độ kỹ năng dựa trên kinh nghiệm
      let userLevel = "junior";
      if (analysisResult.experienceLevel === "senior") {
        userLevel = "senior";
      } else if (analysisResult.experienceLevel === "mid") {
        userLevel = "mid";
      }

      const skillMatch: SkillMatch = {
        skill_id: careerSkill.skill.skill_id,
        skill_name: careerSkill.skill.skill_name,
        required_level: careerSkill.required_level || "mid",
        user_level: hasSkill ? userLevel : "none",
        gap: hasSkill ? 0 : 1,
        percentage: hasSkill ? (userLevel === careerSkill.required_level ? 100 : 70) : 0
      };

      if (hasSkill) {
        matchedSkills.push(skillMatch);
        totalScore += skillMatch.percentage;
      } else {
        missingSkills.push(skillMatch);
      }
    }

    const overallScore = requiredSkills.length > 0
      ? Math.round((totalScore / (requiredSkills.length * 100)) * 100)
      : 0;

    // Tạo recommendations
    const recommendations: string[] = [];
    if (overallScore < 50) {
      const topMissingSkills = missingSkills.slice(0, 3).map(s => s.skill_name).join(", ");
      recommendations.push(`🚀 Bạn cần tập trung vào các kỹ năng cơ bản: ${topMissingSkills}`);
    }
    if (missingSkills.length > 0) {
      recommendations.push(`⏳ Còn thiếu ${missingSkills.length} kỹ năng yêu cầu. Hãy hoàn thành các khóa học liên quan.`);
    }
    if (analysisResult.technicalLevel < 2) {
      recommendations.push("💡 Bạn nên tích lũy thêm kinh nghiệm thực tế qua các dự án mini.");
    }
    if (matchedSkills.length > 0) {
      recommendations.push(`✅ Bạn đã nắm vững ${matchedSkills.length} kỹ năng. Hãy tiếp tục phát triển!`);
    }

    console.log(`Capability Report: Score=${overallScore}%, Matched=${matchedSkills.length}, Missing=${missingSkills.length}`);

    return {
      career_name: roadmap.career.career_name,
      roadmap_id: roadmap.roadmap_id,
      overall_score: overallScore,
      matched_skills: matchedSkills,
      missing_skills: missingSkills,
      recommendations
    };
  } catch (error: any) {
    console.error("Skill comparison error:", error.message);
    throw new Error("Failed to compare skills with roadmap");
  }
};

// Lưu báo cáo CV analysis vào database
export const saveCVAnalysisReport = async (
  userId: number,
  cvContent: string,
  report: RoadmapCapabilityReport
): Promise<any> => {
  try {
    // Lưu vào AIChatHistory để lưu trữ
    const chatHistory = await prisma.aIChatHistory.create({
      data: {
        user_id: userId,
        question: "CV Analysis - Skill Gap Report",
        answer: JSON.stringify(report, null, 2)
      }
    });

    console.log(`Saved CV analysis report for user ${userId}`);
    return chatHistory;
  } catch (error: any) {
    console.error("Save report error:", error.message);
    // Không throw error nếu lưu failed - vẫn trả về report
    return { success: false };
  }
};
