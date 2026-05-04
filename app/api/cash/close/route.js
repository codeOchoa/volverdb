import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { finalAmount } = await req.json();

        const safeFinal = Number(finalAmount);
        if (isNaN(safeFinal)) {
            return NextResponse.json(
                { success: false, message: "El monto final no es válido." },
                { status: 400 }
            );
        }

        const rows = await query(
            `SELECT id 
            FROM cash_register 
            WHERE status = 'open'
            ORDER BY opened_at DESC
            LIMIT 1`
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { success: false, message: "No hay ninguna caja abierta actualmente." },
                { status: 400 }
            );
        }

        const cashId = rows[0].id;

        await query(
            `UPDATE cash_register
            SET final_amount = ?, closed_at = NOW(), status = 'closed'
            WHERE id = ?`,
            [safeFinal, cashId]
        );

        return NextResponse.json(
            { success: true,
                message: "La caja fue cerrada correctamente.",
                id: cashId,
            },
            { status: 200 }
        );

    } catch (err) {
        console.error("❌ Error cerrando caja:", err);
        return NextResponse.json(
            { success: false,
                message: "Error interno del servidor.",
                details: process.env.NODE_ENV ? err.message : undefined,
            },
            { status: 500 }
        );
    }
}
