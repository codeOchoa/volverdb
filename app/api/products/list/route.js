import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const rows = await query(`SELECT 
        id,
        sku,
        ean,
        name,
        stock,
        price_buy AS cost,
        price_sell AS price,
        percent_applied,
        category,
        distributor,
        DATE_FORMAT(date_in, '%Y-%m-%d') AS entryDate,
        DATE_FORMAT(date_exp, '%Y-%m-%d') AS expiryDate
        FROM products
        WHERE (deleted = 0 OR deleted IS NULL)
        ORDER BY name ASC`);

        return NextResponse.json(
            { success: true,
                count: rows.length,
                data: rows,
            },
            { status: 200 }
        );

    } catch (err) {
        console.error("❌ Error al listar productos:", err);

        return NextResponse.json(
            { success: false,
                message: "Error al obtener la lista de productos.",
                details: process.env.NODE_ENV ? err.message : undefined,
            },
            { status: 500 }
        );
    }
}