import db from "@/lib/db";

export async function POST(req) {
    try {
        const { finalAmount } = await req.json();

        const [openCash] = await db.query(
            "SELECT id FROM cash_register WHERE status = 'open' LIMIT 1"
        );

        if (openCash.length === 0) {
            return Response.json({ ok: false, message: "No hay caja abierta" }, { status: 400 });
        }

        const id = openCash[0].id;

        await db.query(
            "UPDATE cash_register SET final_amount = ?, closed_at = NOW(), status = 'closed' WHERE id = ?",
            [parseFloat(finalAmount), id]
        );

        return Response.json({ ok: true, message: "Caja cerrada correctamente" });
    } catch (err) {
        console.error("Error cerrando caja:", err);
        return Response.json({ ok: false, error: err.message }, { status: 500 });
    }
}