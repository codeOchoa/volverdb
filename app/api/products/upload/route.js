import db from "@/lib/db";

export async function POST(req) {
    try {
        const products = await req.json();

        for (const p of products) {
            await db.query(
                `
        INSERT INTO products (ean, name, price, stock)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            price = VALUES(price),
            stock = VALUES(stock)
        `,
                [p.ean, p.name, p.price, p.stock]
            );
        }

        return Response.json({ ok: true, message: "Productos sincronizados" });
    } catch (err) {
        console.error("Error al subir productos:", err);
        return Response.json({ ok: false, error: err.message }, { status: 500 });
    }
}