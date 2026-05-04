import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const ean = searchParams.get("ean");

        if (!ean) {
        return NextResponse.json(
                { success: false, message: "Parámetro 'ean' requerido." },
                { status: 400 }
            );
        }
        const rows = await query(
            `SELECT 
            id,
            sku,
            ean,
            name,
            price_sell AS price,
            stock,
            distributor
            FROM products
            WHERE ean = ?
            AND (deleted = 0 OR deleted IS NULL)
            LIMIT 1`,
            [ean]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { success: false, message: "Producto no encontrado." },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: rows[0] }, { status: 200 });
    } catch (err) {
        console.error("❌ Error buscando producto:", err);
        return NextResponse.json(
            { success: false,
                message: "Error interno del servidor.",
                details: process.env.NODE_ENV ? err.message : undefined,
            },
            { status: 500 }
        );
    }
}