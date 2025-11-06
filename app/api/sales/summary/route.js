import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [byMethod] = await db.query(
            `SELECT payment_method,
            SUM(total) AS total_amount,
            COUNT(*) AS count
            FROM sales
            WHERE date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY payment_method
            ORDER BY total_amount DESC`
        );

        const [byDay] = await db.query(
            `SELECT DATE(date) AS day,
            SUM(total) AS total_amount,
            COUNT(*) AS count
            FROM sales
            WHERE date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(date)
            ORDER BY day ASC`
        );

        const totalGeneral = byMethod.reduce((sum, m) => sum + parseFloat(m.total_amount), 0);
        const cantidadVentas = byMethod.reduce((sum, m) => sum + parseInt(m.count), 0);

        return NextResponse.json({
            range: {
                start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                end: new Date().toISOString().split("T")[0],
            },
            resumen: {
                totalGeneral,
                cantidadVentas,
                metodos: byMethod,
                porDia: byDay,
            },
        });
    } catch (err) {
        console.error("Error al obtener resumen de ventas:", err);
        return NextResponse.json(
            { message: "Error interno del servidor", error: err.message },
            { status: 500 }
        );
    }
}