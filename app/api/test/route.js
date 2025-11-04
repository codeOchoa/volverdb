import db from "@/lib/db";

export async function GET() {
    try {
        const [rows] = await db.query("SELECT NOW() AS time");
        return Response.json({ ok: true, time: rows[0].time });
    } catch (err) {
        console.error("DB error:", err);
        return Response.json({ ok: false, error: err.message });
    }
}