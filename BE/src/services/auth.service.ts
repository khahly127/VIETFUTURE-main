import { prisma } from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { DEFAULT_ENTERPRISE_PERMISSIONS } from "../utils/permissions";
import { verifyGoogleIdToken } from "../utils/google";

const isEnterpriseOrEmployerRole = (role: string) =>
    role === "enterprise" || role === "employer";

const getUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: {
            email
        }
    });
};

export const registerService = async (data: any) => {
    const existing = await getUserByEmail(data.email);

    if (existing) {
        throw new Error("User with this email already exists");
    }

    const { password, ...userData } = data;
    const password_hash = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            ...userData,
            password_hash
        }
    });

    // Lấy quyền mặc định cho enterprise/employer
    const permissions = isEnterpriseOrEmployerRole(user.role as string) ? DEFAULT_ENTERPRISE_PERMISSIONS : [];

    const token = generateToken({
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        permissions
    });

    return {
        user,
        token
    };
};

export const loginService = async (email: string, password: string) => {
    const user = await getUserByEmail(email);

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isValid = await comparePassword(password, user.password_hash);

    if (!isValid) {
        throw new Error("Invalid credentials");
    }

    // Lấy quyền mặc định cho enterprise/employer
    const permissions = isEnterpriseOrEmployerRole(user.role as string) ? DEFAULT_ENTERPRISE_PERMISSIONS : [];

    const token = generateToken({
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        permissions
    });

    return {
        user,
        token
    };
};

export const googleAuthService = async (email: string, name: string, role?: string) => {
    let user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        const randomPassword = Math.random().toString(36).substring(2, 12);
        const password_hash = await hashPassword(randomPassword);

        user = await prisma.user.create({
            data: {
                email,
                full_name: name,
                password_hash,
                role: (role === "enterprise" ? "enterprise" : "student") as any,
                status: "active"
            }
        });
    } else if (name && user.full_name !== name) {
        user = await prisma.user.update({
            where: { user_id: user.user_id },
            data: { full_name: name }
        });
    }

    const permissions = isEnterpriseOrEmployerRole(user.role as string)
        ? DEFAULT_ENTERPRISE_PERMISSIONS
        : [];

    const token = generateToken({
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        permissions
    });

    const { password_hash: _, ...safeUser } = user;

    return {
        user: safeUser,
        token
    };
};

export const googleAuthWithCredential = async (
    credential: string,
    role?: string
) => {
    const googleUser = await verifyGoogleIdToken(credential);
    return googleAuthService(googleUser.email, googleUser.name, role);
};

