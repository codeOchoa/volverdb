import db from "@/lib/db";

export async function PUT(req) {
    try {
        const { ean, name, price, stock } = await req.json();

        await db.query(
            "UPDATE products SET name = ?, price = ?, stock = ? WHERE ean = ?",
            [name, price, stock, ean]
        );

        return Response.json({ ok: true, message: "Producto actualizado" });
    } catch (err) {
        console.error("Error al actualizar producto:", err);
        return Response.json({ ok: false, message: "Error al actualizar" }, { status: 500 });
    }
}