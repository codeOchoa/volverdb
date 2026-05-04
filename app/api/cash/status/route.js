import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const openRows = await query(
            `SELECT id, date, initial_amount, opened_at, status 
            FROM cash_register
            WHERE status = 'open'
            ORDER BY opened_at DESC
            LIMIT 1`
        );

        if (openRows.length > 0) {
            const data = openRows[0];
            const today = new Date().toISOString().slice(0, 10);
            const openDate = new Date(data.date).toISOString().slice(0, 10);

            if (openDate !== today) {
                await query(
                    `UPDATE cash_register 
                    SET status = 'closed',
                    final_amount = initial_amount,
                    closed_at = NOW()
                    WHERE id = ?`,
                    [data.id]
                );

                return NextResponse.json(
                    { success: true,
                        isOpen: false,
                        autoClosed: true,
                        message: "Caja cerrada automáticamente.",
                    },
                    { status: 200 }
                );
            }

            return NextResponse.json(
                { success: true,
                    isOpen: true,
                    data,
                },
                { status: 200 }
            );
        }

        const closedRows = await query(
            `SELECT id, date, final_amount, closed_at, status
            FROM cash_register
            WHERE status = 'closed'
            ORDER BY closed_at DESC
            LIMIT 1`
        );

        return NextResponse.json(
            { success: true,
                isOpen: false,
                data: closedRows.length > 0 ? closedRows[0] : null,
            },
            { status: 200 }
        );

    } catch (err) {
        console.error("❌ Error obteniendo estado de caja:", err);

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