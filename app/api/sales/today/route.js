import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [sales] = await db.query(
            `SELECT id, date, payment_method, subtotal, adjustment, total
        FROM sales
        WHERE DATE(date) = CURDATE()
        ORDER BY date DESC`
        );

        const [totals] = await db.query(
            `SELECT payment_method, SUM(total) AS total_amount, COUNT(*) AS count
        FROM sales
        WHERE DATE(date) = CURDATE()
        GROUP BY payment_method
        ORDER BY total_amount DESC`
        );

        const totalGeneral = totals.reduce((sum, t) => sum + parseFloat(t.total_amount), 0);

        return NextResponse.json({
            date: new Date().toISOString().split("T")[0],
            sales,
            summary: {
                methods: totals,
                totalGeneral,
            },
        });
    } catch (err) {
        console.error("Error al obtener ventas diarias:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}