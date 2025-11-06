import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [salesToday] = await db.query(`
        SELECT 
        s.payment_method AS paymentMethod,
        SUM(s.total) AS totalAmount,
        COUNT(s.id) AS totalSales
        FROM sales s
        WHERE DATE(s.date) = CURDATE()
        GROUP BY s.payment_method
    `);

        const [summary] = await db.query(`
        SELECT 
        SUM(total) AS totalGeneral,
        COUNT(id) AS totalTransacciones
        FROM sales
        WHERE DATE(date) = CURDATE()
    `);

        return NextResponse.json({
            summary: summary[0],
            breakdown: salesToday,
        });
    } catch (err) {
        console.error("Error al obtener ventas diarias:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
