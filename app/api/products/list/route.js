import db from "@/lib/db";

export async function GET() {
    const [rows] = await db.query("SELECT * FROM products ORDER BY name ASC");
    return Response.json(rows);
}