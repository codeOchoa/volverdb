import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signAuthToken } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(req) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json(
                { success: false, message: "Usuario y contraseña son obligatorios." },
                { status: 400 }
            );
        }

        const rows = await query(
            "SELECT id, username, password, role FROM users WHERE username = ? LIMIT 1",
            [username]
        );

        if (rows.length === 0) {
            await bcrypt.compare(
                password,
                "$2a$10$invalidinvalidinvalidinvalidinv"
            );
            return NextResponse.json(
                { success: false, message: "Credenciales inválidas." },
                { status: 401 }
            );
        }

        const user = rows[0];
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return NextResponse.json(
                { success: false, message: "Credenciales inválidas." },
                { status: 401 }
            );
        }

        const token = await signAuthToken(user);

        const res = NextResponse.json({
            success: true,
            message: "Login exitoso.",
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        });

        res.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24,
        });

        return res;

    } catch (err) {
        console.error("❌ Error en login:", err);
        return NextResponse.json(
            { success: false,
                message: "Error interno del servidor.",
                details: process.env.NODE_ENV ? err.message : undefined,
            },
            { status: 500 }
        );
    }
}