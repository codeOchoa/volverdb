import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { date, initialAmount } = await req.json();

        const safeInitial = Number(initialAmount);
        if (isNaN(safeInitial)) {
            return NextResponse.json(
                { success: false,
                    message: "El monto inicial no es válido.",
                },
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

        if (rows.length > 0) {
            return NextResponse.json(
                { success: false,
                    message: "Ya existe una caja abierta.",
                },
                { status: 400 }
            );
        }

        let safeDate = new Date().toISOString().slice(0, 10);

        if (date && typeof date === "string" && date.trim() !== "") {
            const formatted = new Date(date).toISOString().slice(0, 10);
            safeDate = formatted;
        }

        await query(
            `INSERT INTO cash_register (date, initial_amount, opened_at, status)
            VALUES (?, ?, NOW(), 'open')`,
            [safeDate, safeInitial]
        );

        return NextResponse.json(
            { success: true,
                message: "Caja abierta correctamente.",
            },
            { status: 201 }
        );

    } catch (err) {
        console.error("❌ Error abriendo caja:", err);

        return NextResponse.json(
            { success: false,
                message: "Error interno del servidor.",
                details: process.env.NODE_ENV ? err.message : undefined,
            },
            { status: 500 }
        );
    }
}