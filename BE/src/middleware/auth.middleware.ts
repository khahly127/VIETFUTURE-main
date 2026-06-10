import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import { TokenPayload } from "../utils/jwt";

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "No token"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as TokenPayload;

        (req as any).user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user as TokenPayload | undefined;

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        if (!roles.includes(user.role)) {
            return res.status(403).json({
                message: "Forbidden: insufficient privileges"
            });
        }

        next();
    };
};

export const authorizeAdmin = authorizeRoles("admin");

export const authorizeEnterprise = authorizeRoles("enterprise", "employer", "admin");

export const authorizeEnterpriseOnly = authorizeRoles("enterprise", "employer");

// Phân quyền cho doanh nghiệp với các hành động cụ thể
export const authorizeEnterpriseAction = (requiredPermissions: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user as TokenPayload | undefined;

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        if (user.role !== "enterprise" && user.role !== "employer" && user.role !== "admin") {
            return res.status(403).json({
                message: "Forbidden: chỉ doanh nghiệp và admin có quyền truy cập"
            });
        }

        // Admin luôn có đủ quyền
        if (user.role === "admin") {
            next();
            return;
        }

        // Kiểm tra quyền của enterprise (có thể lưu trong DB hoặc decode từ token)
        const userPermissions = user.permissions || [];
        const hasPermission = requiredPermissions.some(p => userPermissions.includes(p));

        if (!hasPermission) {
            return res.status(403).json({
                message: "Forbidden: không có quyền thực hiện hành động này"
            });
        }

        next();
    };
};
