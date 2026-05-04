import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const days = 7;

        const byMethodRows = await query(
            `SELECT 
            payment_method AS paymentMethod,
            SUM(total) AS totalAmount,
            COUNT(*) AS count
            FROM sales
            WHERE date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            GROUP BY payment_method
            ORDER BY totalAmount DESC`,
            [days]
        );

        const methods = byMethodRows.map((m) => ({
            paymentMethod: m.paymentMethod,
            totalAmount: Number(m.totalAmount) || 0,
            count: Number(m.count) || 0,
        }));

        const byDayRows = await query(
            `SELECT 
            DATE(date) AS day,
            SUM(total) AS totalAmount,
            COUNT(*) AS count
            FROM sales
            WHERE date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            GROUP BY DATE(date)
            ORDER BY day ASC`,
            [days]
        );

        const byDay = byDayRows.map((d) => ({
            day: d.day,
            totalAmount: Number(d.totalAmount) || 0,
            count: Number(d.count) || 0,
        }));

        const totalAmountGeneral = methods.reduce((sum, m) => sum + m.totalAmount, 0);
        const totalTransactions = methods.reduce((sum, m) => sum + m.count, 0);

        const endDate = new Date().toISOString().split("T")[0];
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];

        return NextResponse.json(
            {
                success: true,
                range: { start: startDate,
                    end: endDate,
                },
                summary: { totalAmount: totalAmountGeneral,
                    totalTransactions,
                    methods,
                    byDay,
                },
            },
            { status: 200 }
        );

    } catch (err) {
        console.error("❌ Error al obtener resumen de ventas:", err);

        return NextResponse.json(
            { success: false,
                message: "Error interno del servidor.",
                details:
                    process.env.NODE_ENV ? err.message : undefined,
            },
            { status: 500 }
        );
    }
}