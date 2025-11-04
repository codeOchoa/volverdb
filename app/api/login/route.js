import bcrypt from "bcryptjs";
import db from "@/lib/db";

export async function POST(req) {
    try {
        const { username, password } = await req.json();
        const [users] = await db.query("SELECT * FROM users WHERE username = ?", [username]);

        if (users.length === 0) {
            return Response.json({ ok: false, message: "Usuario no encontrado" }, { status: 401 });
        }

        const user = users[0];
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return Response.json({ ok: false, message: "Contraseña incorrecta" }, { status: 401 });
        }

        const token = crypto.randomUUID();
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        return Response.json({ ok: true, token, expires });
    } catch (err) {
        console.error("Error en login:", err);
        return Response.json({ ok: false, error: err.message }, { status: 500 });
    }
}