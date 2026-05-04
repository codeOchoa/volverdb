import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) throw new Error("JWT_SECRET is required");

const encoder = new TextEncoder();
const secretKey = encoder.encode(JWT_SECRET);

export async function signAuthToken(user) {
    return new SignJWT({ username: user.username, role: user.role })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setSubject(String(user.id))
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(secretKey);
}

export async function verifyAuthToken(token) {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
}