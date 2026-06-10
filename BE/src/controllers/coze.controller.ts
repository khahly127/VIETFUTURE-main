import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import {
    generalChat,
    analyzeCV,
    askQuestionAboutCV
} from "../services/coze.service";

// General chat with Coze
export const cozeChat = async (req: Request, res: Response) => {
    try {
        const { message, user_id } = req.body;

        if (!message) {
            return res.status(400).json({
                message: "Message is required"
            });
        }

        const answer = await generalChat(message);

        // Save to chat history if user_id provided
        if (user_id) {
            await prisma.aIChatHistory.create({
                data: {
                    user_id,
                    question: message,
                    answer
                }
            });
        }

        return res.status(200).json({
            message: "Chat success",
            data: {
                question: message,
                answer
            }
        });
    } catch (error: any) {
        console.error("Chat error:", error.message);
        return res.status(500).json({
            message: "Failed to get chat response",
            error: error.message
        });
    }
};

// Analyze CV
export const analyzeCVController = async (req: Request, res: Response) => {
    try {
        const { cvContent, user_id } = req.body;

        if (!cvContent) {
            return res.status(400).json({
                message: "CV content is required"
            });
        }

        const analysis = await analyzeCV(cvContent);

        // Save analysis to chat history
        if (user_id) {
            await prisma.aIChatHistory.create({
                data: {
                    user_id,
                    question: "CV Analysis",
                    answer: analysis
                }
            });
        }

        return res.status(200).json({
            message: "CV analysis success",
            data: {
                analysis
            }
        });
    } catch (error: any) {
        console.error("CV analysis error:", error.message);
        return res.status(500).json({
            message: "Failed to analyze CV",
            error: error.message
        });
    }
};

// Ask question about CV
export const askAboutCV = async (req: Request, res: Response) => {
    try {
        const { cvContent, question, user_id } = req.body;

        if (!cvContent || !question) {
            return res.status(400).json({
                message: "CV content and question are required"
            });
        }

        const answer = await askQuestionAboutCV(cvContent, question);

        // Save to chat history
        if (user_id) {
            await prisma.aIChatHistory.create({
                data: {
                    user_id,
                    question: `CV Question: ${question}`,
                    answer
                }
            });
        }

        return res.status(200).json({
            message: "Question answered",
            data: {
                question,
                answer
            }
        });
    } catch (error: any) {
        console.error("CV question error:", error.message);
        return res.status(500).json({
            message: "Failed to answer question",
            error: error.message
        });
    }
};
