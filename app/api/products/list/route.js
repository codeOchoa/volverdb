import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [rows] = await db.query(`
        SELECT 
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
        WHERE deleted = 0 OR deleted IS NULL
        ORDER BY name ASC
    `);

        return NextResponse.json(rows);
    } catch (err) {
        console.error("Error al listar productos:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
