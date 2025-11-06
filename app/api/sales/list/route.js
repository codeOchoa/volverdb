import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [sales] = await db.query(`
        SELECT 
            s.id,
            s.date,
            s.payment_method AS paymentMethod,
            s.subtotal,
            s.adjustment,
            s.total,
            COUNT(si.id) AS items_count
        FROM sales s
        LEFT JOIN sale_items si ON s.id = si.sale_id
        GROUP BY s.id
        ORDER BY s.date DESC
    `);

        return NextResponse.json(sales);
    } catch (err) {
        console.error("Error al obtener ventas:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}