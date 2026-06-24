import { OAuth2Client } from "google-auth-library";

export type GoogleUserInfo = {
    email: string;
    name: string;
    picture?: string;
    googleId: string;
};

export const verifyGoogleIdToken = async (
    idToken: string
): Promise<GoogleUserInfo> => {
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
        throw new Error("Google OAuth is not configured on server");
    }

    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
        idToken,
        audience: clientId
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
        throw new Error("Google token does not contain a valid email");
    }

    if (payload.email_verified === false) {
        throw new Error("Google email is not verified");
    }

    return {
        email: payload.email,
        name: payload.name || payload.email.split("@")[0],
        picture: payload.picture,
        googleId: payload.sub || ""
    };
};
