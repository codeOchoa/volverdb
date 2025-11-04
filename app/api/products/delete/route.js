import db from "@/lib/db";

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const ean = searchParams.get("ean");
    if (!ean) return Response.json({ ok: false, message: "EAN requerido" }, { status: 400 });

    try {
        await db.query("DELETE FROM products WHERE ean = ?", [ean]);
        return Response.json({ ok: true, message: "Producto eliminado" });
    } catch (err) {
        console.error(err);
        return Response.json({ ok: false, message: "Error al eliminar producto" }, { status: 500 });
    }
}