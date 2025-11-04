import db from "@/lib/db";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const ean = searchParams.get("ean");

        if (!ean) {
            return Response.json({ error: "Parámetro 'ean' requerido" }, { status: 400 });
        }

        const [rows] = await db.query("SELECT * FROM products WHERE ean = ? LIMIT 1", [ean]);

        if (rows.length === 0) {
            return Response.json(null, { status: 404 });
        }

        return Response.json(rows[0]);
    } catch (err) {
        console.error("Error buscando producto:", err);
        return Response.json({ error: err.message }, { status: 500 });
    }
}