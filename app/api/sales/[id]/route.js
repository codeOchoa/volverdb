import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json({ message: "Falta el ID de la venta" }, { status: 400 });
        }

        const [sales] = await db.query(
            `SELECT id, date, payment_method, subtotal, adjustment, total, created_at
            FROM sales
            WHERE id = ?`,
            [id]
        );

        if (sales.length === 0) {
            return NextResponse.json({ message: "Venta no encontrada" }, { status: 404 });
        }

        const sale = sales[0];

        const [items] = await db.query(
            `SELECT 
            si.id AS item_id,
            si.product_id,
            p.name AS product_name,
            p.sku,
            p.ean,
            si.quantity,
            si.price,
            (si.quantity * si.price) AS total_item
            FROM sale_items si
            INNER JOIN products p ON si.product_id = p.id
            WHERE si.sale_id = ?
            ORDER BY si.id ASC`,
            [id]
        );

        return NextResponse.json({
            ...sale,
            items,
        });
    } catch (err) {
        console.error("Error obteniendo detalle de venta:", err);
        return NextResponse.json(
            { message: "Error interno del servidor", error: err.message },
            { status: 500 }
        );
    }
}