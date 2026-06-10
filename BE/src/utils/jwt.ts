import jwt from "jsonwebtoken";

export interface TokenPayload {
    user_id: number;
    email: string;
    role: string;
    permissions?: string[];
    [key: string]: any;
}

export const generateToken = (payload: TokenPayload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET!,
        {
            expiresIn: "7d"
        }
    );
};

export const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(
        token,
        process.env.JWT_SECRET!
    ) as TokenPayload;
};