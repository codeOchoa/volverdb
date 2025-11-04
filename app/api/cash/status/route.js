import db from "@/lib/db";

export async function GET() {
    try {
        const [openCash] = await db.query(`
        SELECT id, date, initial_amount, opened_at, status
        FROM cash_register
        WHERE status = 'open'
        ORDER BY opened_at DESC
        LIMIT 1
    `);

        if (openCash.length > 0) {
            return Response.json({
                ok: true,
                isOpen: true,
                data: openCash[0],
            });
        }

        const [lastClosed] = await db.query(`
        SELECT id, date, final_amount, closed_at, status
        FROM cash_register
        WHERE status = 'closed'
        ORDER BY closed_at DESC
        LIMIT 1
    `);

        return Response.json({
            ok: true,
            isOpen: false,
            data: lastClosed[0] || null,
        });
    } catch (err) {
        console.error("Error obteniendo estado de caja:", err);
        return Response.json({ ok: false, error: err.message }, { status: 500 });
    }
}