import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { usersDB } from "./db.js";

const SECRET = process.env.JWT_SECRET || "super-clave-local";

export const createToken = (user) => {
    return jwt.sign({ username: user.username }, SECRET, { expiresIn: "24h" });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET);
    } catch {
        return null;
    }
};

export const loginUser = async (username, password) => {
    const user = await usersDB.findOne({ username });
    if (!user) return null;
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;
    return createToken(user);
};