import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req) {
    try {
        const data = await req.json();

        const {
            id,
            sku,
            ean,
            name,
            stock,
            price_buy,
            price_sell,
            percent_applied,
            category,
            distributor,
            date_in,
            date_exp
        } = data;

        if (!ean || !name || !distributor) {
            return NextResponse.json({ error: "EAN, nombre y distribuidor son obligatorios" }, { status: 400 });
        }

        const [existing] = await db.query(
            "SELECT id FROM products WHERE ean = ? AND name = ? AND distributor = ?",
            [ean, name, distributor]
        );

        if (existing.length === 0) {
            return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
        }

        await db.query(
            `UPDATE products SET 
            sku = ?, 
            stock = ?, 
            price_buy = ?, 
            price_sell = ?, 
            percent_applied = ?, 
            category = ?, 
            distributor = ?, 
            date_in = ?, 
            date_exp = ?, 
            updated_at = NOW()
            WHERE ean = ? AND name = ? AND distributor = ?`,
            [
                sku || null,
                stock || 0,
                price_buy || 0,
                price_sell || 0,
                percent_applied || 0,
                category || null,
                distributor || null,
                date_in || null,
                date_exp || null,
                ean,
                name,
                distributor,
            ]
        );

        return NextResponse.json({ message: "Producto actualizado correctamente", success: true });
    } catch (err) {
        console.error("Error al editar producto:", err);
        return NextResponse.json({ error: "Error interno del servidor", details: err.message }, { status: 500 });
    }
}