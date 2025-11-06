import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const ean = searchParams.get("ean");

        if (!ean) {
            return NextResponse.json(
                { error: "Falta el parámetro EAN" },
                { status: 400 }
            );
        }

        const [existing] = await db.query(
            "SELECT id FROM products WHERE ean = ? AND (deleted = 0 OR deleted IS NULL)",
            [ean]
        );

        if (existing.length === 0) {
            return NextResponse.json(
                { error: "Producto no encontrado" },
                { status: 404 }
            );
        }

        await db.query(
            "UPDATE products SET deleted = 1, updated_at = NOW() WHERE ean = ?",
            [ean]
        );

        return NextResponse.json({
            ok: true,
            message: "Producto eliminado correctamente",
        });
    } catch (err) {
        console.error("Error al eliminar producto:", err);
        return NextResponse.json(
            { ok: false, error: err.message },
            { status: 500 }
        );
    }
}