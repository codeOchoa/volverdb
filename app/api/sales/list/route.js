import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);

        const page = Math.max(Number(searchParams.get("page")) || 1, 1);
        const limit = 20;
        const offset = (page - 1) * limit;

        const date = searchParams.get("date"); 
        const start = searchParams.get("start"); 
        const end = searchParams.get("end"); 
        const payment = searchParams.get("payment"); 

        const conditions = [];
        const params = [];

        if (date) {
            conditions.push("s.date = ?");
            params.push(date);
        }

        if (start) {
            conditions.push("s.date >= ?");
            params.push(start);
        }

        if (end) {
            conditions.push("s.date <= ?");
            params.push(end);
        }

        if (payment) {
            conditions.push("s.payment_method = ?");
            params.push(payment);
        }

        const whereClause =
            conditions.length > 0
                ? `WHERE ${conditions.join(" AND ")}`
                : "";

        const totalRows = await query(
            `SELECT COUNT(*) AS total
            FROM sales s
            ${whereClause}`,
            params
        );

        const total = totalRows[0]?.total || 0;
        const totalPages = Math.ceil(total / limit);

        const rows = await query(
            `SELECT 
            s.id,
            s.date,
            s.payment_method AS paymentMethod,
            s.subtotal,
            s.adjustment,
            s.total,
            COUNT(si.id) AS itemsCount
            FROM sales s
            LEFT JOIN sale_items si ON s.id = si.sale_id
            ${whereClause}
            GROUP BY s.id
            ORDER BY s.date DESC, s.id DESC
            LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        return NextResponse.json(
            { success: true,
                page,
                total,
                totalPages,
                limit,
                count: rows.length,
                data: rows,
                filters: { date,
                    start,
                    end,
                    payment,
                },
            },
            { status: 200 }
        );

    } catch (err) {
        console.error("❌ Error al obtener ventas:", err);

        return NextResponse.json(
            { success: false,
                message: "Error al obtener ventas.",
                details: process.env.NODE_ENV ? err.message : undefined,
            },
            { status: 500 }
        );
    }
}