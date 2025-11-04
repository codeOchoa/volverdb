import db from "@/lib/db";

export async function POST(req) {
    try {
        const { date, initialAmount } = await req.json();

        const [openCash] = await db.query(
            "SELECT id FROM cash_register WHERE status = 'open' LIMIT 1"
        );

        if (openCash.length > 0) {
            return Response.json({ ok: false, message: "Ya hay una caja abierta" }, { status: 400 });
        }

        await db.query(
            "INSERT INTO cash_register (date, initial_amount, opened_at, status) VALUES (?, ?, NOW(), 'open')",
            [date, parseFloat(initialAmount)]
        );

        return Response.json({ ok: true, message: "Caja abierta correctamente" });
    } catch (err) {
        console.error("Error abriendo caja:", err);
        return Response.json({ ok: false, error: err.message }, { status: 500 });
    }
}