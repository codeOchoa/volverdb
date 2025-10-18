import { salesDB, productsDB } from "@/lib/db";

export async function POST(req) {
    const sale = await req.json();
    sale.createdAt = new Date();

    for (const it of sale.items) {
        const p = await productsDB.findOne({ ean: it.ean });
        if (p && typeof p.stock === "number") {
            await productsDB.update({ ean: it.ean }, { $set: { stock: Math.max(0, (p.stock - it.qty)) } });
        }
    }
    await salesDB.insert(sale);
    return Response.json({ ok: true });
}