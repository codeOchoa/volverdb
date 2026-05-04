import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req) {
    try {
        const userId = req.headers.get("x-user-id");

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "No autenticado." },
                { status: 401 }
            );
        }

        const rows = await query(
            "SELECT id, username, role FROM users WHERE id = ? LIMIT 1",
            [userId]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { success: false, message: "Usuario no encontrado." },
                { status: 404 }
            );
        }

        const user = rows[0];

        return NextResponse.json(
            { success: true,
                data: { id: user.id,
                    username: user.username,
                    role: user.role,
                },
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("❌ Error en /api/me:", err);
        return NextResponse.json(
            { success: false,
                message: "Error interno del servidor.",
                details: process.env.NODE_ENV ? err.message : undefined,
            },
            { status: 500 }
        );
    }
}