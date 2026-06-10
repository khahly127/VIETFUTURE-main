import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import * as assessmentService from "../services/assessment.service";

export const getAllAssessments = async (req: Request, res: Response) => {
    try {
        const assessments = await assessmentService.getAssessmentsService();
        return res.status(200).json(assessments);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const getAssessmentByRole = async (req: Request, res: Response) => {
    try {
        const { role } = req.params;
        const assessment = await assessmentService.getAssessmentByRoleService(String(role));

        if (!assessment) {
            return res.status(404).json({ error: "Assessment not found" });
        }

        return res.status(200).json(assessment);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const createAssessment = async (req: Request, res: Response) => {
    try {
        const assessment = await assessmentService.createAssessmentService(req.body);
        return res.status(201).json(assessment);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const createQuestion = async (req: Request, res: Response) => {
    try {
        const assessmentId = Number(req.params.id);
        const question = await assessmentService.createQuestionService(assessmentId, req.body);
        return res.status(201).json(question);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteQuestion = async (req: Request, res: Response) => {
    try {
        const questionId = Number(req.params.questionId);
        const deleted = await assessmentService.deleteQuestionService(questionId);
        return res.status(200).json(deleted);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateAssessment = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const assessment = await assessmentService.updateAssessmentService(id, req.body);
        return res.status(200).json(assessment);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteAssessment = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await assessmentService.deleteAssessmentService(id);
        return res.status(200).json({ message: "Delete success" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const getAllAttempts = async (req: Request, res: Response) => {
    try {
        const attempts = await prisma.assessmentAttempt.findMany({
            orderBy: { created_at: "desc" },
            include: {
                user: {
                    select: {
                        user_id: true,
                        full_name: true,
                        email: true,
                        role: true,
                        status: true
                    }
                },
                assessment: {
                    select: {
                        assessment_id: true,
                        title: true,
                        total_questions: true
                    }
                },
                reports: {
                    select: {
                        report_id: true,
                        overall_score: true,
                        strengths: true,
                        weaknesses: true,
                        recommendations: true,
                        created_at: true
                    }
                }
            }
        });
        return res.status(200).json(attempts);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteAttempt = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const result = await assessmentService.deleteAttemptService(id);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const createAttempt = async (req: Request, res: Response) => {
    try {
        let userId = Number(req.body.userId);
        if (!userId || isNaN(userId)) {
            const defaultUser = await prisma.user.findFirst({
                where: { role: "student" }
            });
            userId = defaultUser ? defaultUser.user_id : 1;
        }

        let assessmentId = Number(req.body.assessmentId);
        if (!assessmentId || isNaN(assessmentId)) {
            const defaultAssess = await prisma.assessment.findFirst();
            assessmentId = defaultAssess ? defaultAssess.assessment_id : 1;
        }

        const payload = {
            ...req.body,
            userId,
            assessmentId
        };

        // Lưu trực tiếp qua Prisma để chắc chắn trả về attempt_id
        const attempt = await prisma.assessmentAttempt.create({
            data: {
                user_id: userId,
                assessment_id: assessmentId,
                score: Number(req.body.score) || 0,
                status: "completed",
                started_at: new Date(),
                submitted_at: req.body.submittedAt ? new Date(req.body.submittedAt) : new Date(),
                analysis_result: JSON.stringify({
                    scorePercentage: req.body.scorePercentage,
                    strengths: req.body.strengths,
                    weaknesses: req.body.weaknesses,
                    recommendations: req.body.recommendations
                })
            },
            include: {
                user: { select: { user_id: true, full_name: true, email: true, role: true } },
                assessment: { select: { assessment_id: true, title: true, total_questions: true } }
            }
        });

        // Trả về object có attempt_id để frontend dùng cho bước 2, 3
        return res.status(201).json(attempt);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

// Lưu SkillReport sau khi có attempt_id
export const createSkillReport = async (req: Request, res: Response) => {
    try {
        const { userId, attemptId, overallScore, strengths, weaknesses, recommendations } = req.body;

        if (!userId || !attemptId) {
            return res.status(400).json({ error: "userId và attemptId là bắt buộc" });
        }

        const report = await prisma.skillReport.create({
            data: {
                user_id: Number(userId),
                attempt_id: Number(attemptId),
                overall_score: Number(overallScore) || 0,
                strengths: strengths || "",
                weaknesses: weaknesses || "",
                recommendations: recommendations || ""
            }
        });

        return res.status(201).json(report);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

// Lưu từng UserAnswer
export const createUserAnswer = async (req: Request, res: Response) => {
    try {
        const { attemptId, questionId, selectedOptionId, answerText, score } = req.body;

        if (!attemptId || !questionId) {
            return res.status(400).json({ error: "attemptId và questionId là bắt buộc" });
        }

        const answer = await prisma.userAnswer.create({
            data: {
                attempt_id: Number(attemptId),
                question_id: Number(questionId),
                selected_option_id: selectedOptionId ? Number(selectedOptionId) : null,
                answer_text: answerText || null,
                score: score !== undefined ? Number(score) : null
            }
        });

        return res.status(201).json(answer);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};