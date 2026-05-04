import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const breakdown = await query(`SELECT 
            s.payment_method AS paymentMethod,
            SUM(s.total) AS totalAmount,
            COUNT(s.id) AS totalSales
            FROM sales s
            WHERE DATE(s.date) = CURDATE()
            GROUP BY s.payment_method`);

        const summaryRows = await query(`SELECT 
            SUM(total) AS totalGeneral,
            COUNT(id) AS totalTransactions
            FROM sales
            WHERE DATE(date) = CURDATE()`);

        const summary = summaryRows[0] || {
            totalGeneral: 0,
            totalTransactions: 0,
        };

        summary.totalGeneral = Number(summary.totalGeneral) || 0;
        summary.totalTransactions = Number(summary.totalTransactions) || 0;

        const breakdownClean = breakdown.map((row) => ({
            paymentMethod: row.paymentMethod,
            totalAmount: Number(row.totalAmount) || 0,
            totalSales: Number(row.totalSales) || 0,
        }));

        return NextResponse.json(
            { success: true,
                summary,
                breakdown: breakdownClean,
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("❌ Error al obtener ventas diarias:", err);

        return NextResponse.json(
            { success: false,
                message: "Error al obtener ventas de hoy.",
                details:
                    process.env.NODE_ENV ? err.message : undefined,
            },
            { status: 500 }
        );
    }
}