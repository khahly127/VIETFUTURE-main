const ANALYSIS_KEY = "devpath_analysis_result";
const CV_FILE_KEY = "devpath_cv_file";
const CV_META_KEY = "devpath_cv_meta";
const SKILL_GAP_KEY = "skill_gap_result";
const AI_RESULT_KEY = "devpath_ai_result";

export const normalizeSkillList = (skills) => {
  if (!Array.isArray(skills)) return [];

  return skills
    .map((skill) => {
      if (typeof skill === "string") return skill.trim();
      if (skill?.name) return String(skill.name).trim();
      if (skill?.skill) return String(skill.skill).trim();
      return "";
    })
    .filter(Boolean);
};

export const readAnalysisResult = () => {
  try {
    return JSON.parse(localStorage.getItem(ANALYSIS_KEY));
  } catch {
    return null;
  }
};

export const readSkillGapResult = () => {
  try {
    return JSON.parse(localStorage.getItem(SKILL_GAP_KEY));
  } catch {
    return null;
  }
};

export const readCvFile = () => {
  try {
    return JSON.parse(localStorage.getItem(CV_FILE_KEY));
  } catch {
    return null;
  }
};

export const readCvMeta = () => {
  try {
    const meta = JSON.parse(localStorage.getItem(CV_META_KEY));
    if (meta) return meta;

    const analysis = readAnalysisResult();
    const cvFile = readCvFile();

    if (!analysis && !cvFile) return null;

    return {
      fileName: analysis?.fileName || cvFile?.fileName || "resume_cv.pdf",
      fileSize: analysis?.fileSize || cvFile?.fileSize || "",
      fileType: analysis?.fileType || cvFile?.fileType || "application/pdf",
      uploadedAt: analysis?.uploadedAt || cvFile?.uploadedAt || null,
      role: analysis?.role || analysis?.originalRoleName || null
    };
  } catch {
    return null;
  }
};

export const getSkillLists = (analysisResult = readAnalysisResult()) => {
  const gap = readSkillGapResult();

  let skills = normalizeSkillList(analysisResult?.skills);
  let missing = normalizeSkillList(analysisResult?.missing);

  if (skills.length === 0) {
    skills = normalizeSkillList(gap?.matchedSkills);
  }

  if (skills.length === 0) {
    skills = normalizeSkillList(analysisResult?.initialSkills);
  }

  if (missing.length === 0) {
    missing = normalizeSkillList(gap?.missingSkills);
  }

  return { skills, missing };
};

export const saveCvFile = (file) =>
  new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const payload = {
        dataUrl: event.target?.result,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        uploadedAt: new Date().toISOString()
      };

      try {
        localStorage.setItem(CV_FILE_KEY, JSON.stringify(payload));
        localStorage.setItem(CV_META_KEY, JSON.stringify({
          fileName: payload.fileName,
          fileSize: payload.fileSize,
          fileType: payload.fileType,
          uploadedAt: payload.uploadedAt
        }));
        resolve(payload);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error || new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

export const clearCvData = () => {
  localStorage.removeItem(ANALYSIS_KEY);
  localStorage.removeItem(CV_FILE_KEY);
  localStorage.removeItem(CV_META_KEY);
  localStorage.removeItem(SKILL_GAP_KEY);
  localStorage.removeItem(AI_RESULT_KEY);
};

export const formatUploadDate = (value) => {
  if (!value) return "Chưa rõ thời gian";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa rõ thời gian";

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

export const formatFileSize = (bytes) => {
  if (!bytes) return "";
  if (typeof bytes === "string") return bytes;

  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const buildRoadmapPhases = (analysisResult, skillGap) => {
  const { skills, missing } = getSkillLists(analysisResult);
  const progress = analysisResult?.assessmentPercent ?? skillGap?.matchPercentage ?? 0;

  const chunk = (items, size) => {
    const groups = [];
    for (let i = 0; i < items.length; i += size) {
      groups.push(items.slice(i, i + size));
    }
    return groups;
  };

  const learningSkills = missing.length > 0 ? missing : skills;
  const groups = chunk(learningSkills, Math.max(3, Math.ceil(learningSkills.length / 3)));

  if (groups.length === 0) {
    return {
      progress,
      phases: []
    };
  }

  const titles = ["Nền tảng", "Nâng cao", "Chuyên sâu"];
  const durations = ["4-6 tuần", "6-8 tuần", "4-6 tuần"];

  const phases = groups.map((group, index) => {
    let status = "locked";
    let phaseProgress = 0;

    if (progress >= ((index + 1) / groups.length) * 100) {
      status = "completed";
      phaseProgress = 100;
    } else if (progress >= (index / groups.length) * 100) {
      status = "in-progress";
      const span = 100 / groups.length;
      phaseProgress = Math.max(
        0,
        Math.min(100, Math.round(((progress - index * span) / span) * 100))
      );
    }

    return {
      phase: `Giai đoạn ${index + 1}`,
      title: titles[index] || `Giai đoạn ${index + 1}`,
      duration: durations[index] || "4-6 tuần",
      skills: group,
      status,
      progress: phaseProgress
    };
  });

  return { progress, phases };
};
