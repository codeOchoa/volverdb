import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { id } = params;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json(
                { success: false, message: "ID de venta inválido o faltante." },
                { status: 400 }
            );
        }

        const saleId = Number(id);

        const saleRows = await query(
            `SELECT 
            id, 
            date, 
            payment_method, 
            subtotal, 
            adjustment, 
            total, 
            created_at
            FROM sales
            WHERE id = ?
            LIMIT 1`,
            [saleId]
        );

        if (saleRows.length === 0) {
            return NextResponse.json(
                { success: false, message: "Venta no encontrada." },
                { status: 404 }
            );
        }

        const sale = saleRows[0];

        const items = await query(
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
            [saleId]
        );

        return NextResponse.json(
            { success: true,
                sale,
                items,
            },
            { status: 200 }
        );

    } catch (err) {
        console.error("❌ Error obteniendo detalle de venta:", err);

        return NextResponse.json(
            { success: false,
                message: "Error interno del servidor.",
                details: process.env.NODE_ENV ? err.message : undefined,
            },
            { status: 500 }
        );
    }
}